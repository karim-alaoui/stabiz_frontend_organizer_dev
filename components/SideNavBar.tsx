import { useRouter } from 'next/router';

const SideNavBar: React.FC = () => {
  const router = useRouter();

  const handleRegisterFounderClick = () => {
    router.push('/create-founder-page');
  };

  const handleProfileDetailsClick = () => {
    router.push('/profile');
  };

  return (
    <nav>
      <ul>
        <li>
          <button onClick={handleRegisterFounderClick}>Register Founder</button>
        </li>
        <li>
          <button onClick={handleProfileDetailsClick}>My Profile Details</button>
        </li>
      </ul>
    </nav>
  );
};

export default SideNavBar;
