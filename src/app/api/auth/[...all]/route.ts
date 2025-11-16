import { auth } from 'auth';
import { toNextJsHandler } from 'better-auth/next-js';
import arcjet, {
  BotOptions,
  detectBot,
  EmailOptions,
  protectSignup,
  shield,
  slidingWindow,
  SlidingWindowRateLimitOptions
} from '@arcjet/next';
import { findIp } from '@arcjet/ip';

const aj = arcjet({
  key: process.env.ARCJET_API_KEY!,
  characteristics: ['userIdOrIp'],
  rules: [shield({ mode: 'LIVE' })]
});

const botSettings = {
  mode: 'LIVE',
  allow: []
} satisfies BotOptions;

// Restrictive rate limit settings for sign-up requests
const restrictiveRateLimitSettings = {
  mode: 'LIVE',
  max: 10,
  interval: '10m'
} as SlidingWindowRateLimitOptions<[]>;

// Lax rate limit settings for other auth requests than sign-up
const laxRateLimitSettings = {
  mode: 'LIVE',
  max: 60,
  interval: '1m'
} as SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
  mode: 'LIVE',
  block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS']
} satisfies EmailOptions;

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

// Rate limit the POST requests with arcjet
export async function POST(request: Request) {
  // Clone the request so we can read it multiple times
  // it is not allowed to read the body more than once, that is why we clone it
  const clonedRequest = request.clone();
  
  const decision = await checkArcjet(request);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      // Handle rate limit exceeded
      return new Response(null, { status: 429 });
    } else if (decision.reason.isEmail()) {
      // handle types of email blocks
      const emailReason = decision.reason.emailTypes;
      let message = '';

      // Customize messages based on the email reason
      switch (true) {
        case emailReason.includes('INVALID'):
          // Handle invalid email
          message = 'Invalid email address format.';
          break;
        case emailReason.includes('DISPOSABLE'):
          // Handle disposable email
          message = 'Disposable email addresses are not allowed.';
          break;
        case emailReason.includes('NO_MX_RECORDS'):
          // Handle no MX records
          message = 'Email domain is not valid.';
          break;
        default:
          message = 'Invalid email.';
      }

      return Response.json({ message }, { status: 400 });
    } else {
      // Generic denial response
      return new Response(null, { status: 403 });
    }
  }

  // send the cloned request to the auth handler
  return authHandlers.POST(clonedRequest);
}

async function checkArcjet(request: Request) {
  // Check the request against the ArcJet rules
  const body = (await request.json()) as unknown;

  // we need to get the session before we can get the user ID
  const session = await auth.api.getSession({ headers: request.headers });

  // get user ID or IP address (fallback for development)
  const userId = session?.user?.id ?? (findIp(request) || '127.0.0.1');

  // if we are in our sign up url, we want to protect with the rules
  if (request.url.includes('/auth/sign-up')) {
    if (
      body &&
      typeof body === 'object' &&
      'email' in body &&
      typeof body.email === 'string'
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings
          })
        )
        .protect(request, { email: body.email, userIdOrIp: userId }); // fingerprint by email and user ID/IP
    } else {
      // if we don't have an email, google sign up or similar, just use bot and rate limit protection
      return aj
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(request, { userIdOrIp: userId });
    }
  }

  // for all other auth requests, just do bot detection and a lax rate limit (relax rules)
  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(request, { userIdOrIp: userId });
}
