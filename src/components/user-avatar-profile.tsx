import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProfileProps {
  image?: string | null | undefined;
  firstName?: string;
  lastName?: string;
  email?: string;
  showInfo?: boolean;
  fullPage?: boolean;
}

export function UserAvatarProfile({
  image,
  firstName,
  lastName,
  email,
  showInfo = false,
  fullPage = false
}: UserAvatarProfileProps) {
  const styles = {
    fullPage: {
      avatarFallback: 'size-16',
      fullName: 'text-2xl',
      email: 'text-md'
    },
    normal: {
      avatarFallback: '',
      fullName: 'text-sm',
      email: 'text-xs'
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Avatar
        className={cn(styles[fullPage ? 'fullPage' : 'normal'].avatarFallback)}
      >
        <AvatarImage
          src={image || ''}
          alt={firstName && lastName ? `${firstName} ${lastName}` : ''}
        />
        <AvatarFallback className='rounded-lg'>
          {((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase() ||
            'CN'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left leading-tight'>
          <span
            className={cn(
              styles[fullPage ? 'fullPage' : 'normal'].fullName,
              'truncate font-semibold'
            )}
          >
            {`${firstName} ${lastName}` || ''}
          </span>
          <span
            className={cn(
              styles[fullPage ? 'fullPage' : 'normal'].email,
              'truncate'
            )}
          >
            {email}
          </span>
        </div>
      )}
    </div>
  );
}
