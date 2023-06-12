import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if the user is logged in (e.g., by checking the token in local storage)
    const token = localStorage.getItem('organizer-token');
    setLoggedIn(!!token);

    if (token) {
      // Fetch the user profile
      fetch('http://127.0.0.1:8000/api/v1/organizer/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch user profile');
          }
        })
        .then((data) => {
          // Set the user name
          setUserName(data.professional_corporation_name);
        })
        .catch((error) => {
          console.error(error);
          // Handle the error if needed
        });
    }
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
          <span>Welcome, {userName}!</span>
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
