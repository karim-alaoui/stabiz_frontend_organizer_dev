import React, { useState , useEffect } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Send request to the login API endpoint
    fetch('http://127.0.0.1:8000/api/v1/organizer/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the API response contains an 'accessToken' field
        const { accessToken } = data;
        
        // Store the token in local storage
        localStorage.setItem('organizer-token', accessToken);

        // Redirect the user to the desired page
        router.push('/');
      })
      .catch((error) => {
        // Handle any errors here
        console.error(error);
      });
  };
  useEffect(() => {
    // Check if the user is already logged in (e.g., by checking the token in local storage)
    const token = localStorage.getItem('organizer-token');
    if (token) {
      // User is logged in, redirect to the main page
      router.push('/');
    }
  }, []);

  return (
    <div>
      <Header />
      <div>Login Page</div>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} required />
        <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} minLength={8} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
