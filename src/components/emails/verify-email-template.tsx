interface EmailTemplateProps {
  name: string;
  url: string;
}

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components';

export const VerifyEmailTemplate = ({ name, url }: EmailTemplateProps) => (
  <Html>
    <Head />
    <Tailwind
      config={{
        theme: {
          extend: {
            fontFamily: {
              inter: ['Inter', 'sans-serif']
            }
          }
        }
      }}
    >
      <Body className='font-inter bg-white'>
        <Preview>Verify your email</Preview>
        <Container className='mx-auto my-0 px-[25px] pt-5 pb-12'>
          <Heading className='mt-12 text-center text-[28px] font-semibold tracking-widest text-[#FF6363]'>
            THANKS FOR SIGNING UP!
          </Heading>
          <Section className='mx-0 my-6'>
            <Heading className='text-center text-2xl'>Hello, {name}</Heading>
            <Text className='text-base leading-6.5'>
              Please click the link below to verify your email address.
            </Text>
            <Text className='text-base leading-6.5'>
              <Link className='text-[#FF6363]' href={url}>
                Verify email!
              </Link>
            </Text>
            <Text className='text-base leading-6.5'>
              This link will expire in 24 hours.
            </Text>
            <Text className='mt-3 text-base leading-6.5'>
              If you didn&apos;t request this, please ignore this email.
            </Text>
          </Section>
          <Text className='text-base leading-6.5'>
            Best,
            <br />- TubeBoost Team
          </Text>
          <Hr className='mt-12 border-[#dddddd]' />
          <Text className='ml-1 text-xs leading-6 text-[#8898aa]'>
            © {new Date().getFullYear()} TubeBoost. All Rights Reserved.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default VerifyEmailTemplate;
