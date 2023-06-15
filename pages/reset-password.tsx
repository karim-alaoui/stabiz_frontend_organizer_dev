import { useState , useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if the user is already logged in (e.g., by checking the token in local storage)
    const token = localStorage.getItem('organizer-token');
    if (token) {
      // User is logged in, redirect to the main page
      router.push('/');
    }
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }
    
    const email = router.query.email as string;
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/organizer/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          password: newPassword,
        }),
      });
    
      if (response.ok) {
        router.push(`/login?password-reset-success=true`);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Password reset failed.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };


  return (
    <div>
      <Header />
      <div>
        <h1>Reset password</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="One time password">One time password:</label>
            <input type="text" id="OTP" value={code} onChange={handleCodeChange} required />
          </div>
          <div>
            <label htmlFor="New password">New password:</label>
            <input type="password" value={newPassword} onChange={handleNewPasswordChange} required />
          </div>
          <div>
            <label htmlFor="Confirm new password">Confirm new password:</label>
            <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
          </div>
          <button type="submit">Reset Password</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
