import { UserAvatarProfile } from '@/components/user-avatar-profile';

interface UserProfileProps {
  firstName: string;
  lastName: string;
  email: string;
}

const UserProfile = ({ firstName, lastName, email }: UserProfileProps) => {
  return (
    <>
      <UserAvatarProfile
        firstName={firstName}
        lastName={lastName}
        email={email}
        showInfo
        fullPage
      />
    </>
  );
};
export default UserProfile;
