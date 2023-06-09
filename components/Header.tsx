import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (e.g., by checking the token in local storage)
    const token = localStorage.getItem('organizer-token');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Perform logout logic here (e.g., delete the token from local storage)
    localStorage.removeItem('organizer-token');
    router.push('/login');
  };

  return (
    <header>
      {loggedIn ? (
        <div>
          <span>Welcome, John Doe!</span> {/* Replace with actual user name */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => router.push('/register')}>Register</button>
          <button onClick={() => router.push('/login')}>Login</button>
        </div>
      )}
    </header>
  );
};

export default Header;
