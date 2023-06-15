import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

const ResetPasswordPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    useEffect(() => {
      // Check if the user is already logged in (e.g., by checking the token in local storage)
      const token = localStorage.getItem('organizer-token');
      if (token) {
        // User is logged in, redirect to the main page
        router.push('/');
      }
    }, []);
  
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/organizer/forget-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
  
        if (response.ok) {
          setMessage(data.message);
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        } else {
          setMessage('Failed to reset password. Please try again.');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        setMessage('Failed to reset password. Please try again.');
      }
    };
  
    return (
      <div>
        <Header />
        <div>
          <h1>Forgot password</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="E-mail">E-mail:</label>
              <input type="email" id="email" value={email} onChange={handleEmailChange} required />
            </div>
            <button type="submit">Reset Password</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    );
  };
  
  export default ResetPasswordPage;
  
