import React, { useState , useEffect} from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [professionalCorporationName, setProfessionalCorporationName] = useState('');
  const [personInCharge, setPersonInCharge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [squareOneMembersId, setSquareOneMembersId] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registrationData = {
      email,
      password,
      professional_corporation_name: professionalCorporationName,
      name_of_person_in_charge: personInCharge,
      phone_number: phoneNumber,
      square_one_members_id: squareOneMembersId,
    };

    fetch('http://127.0.0.1:8000/api/v1/register/organizer', {
      method: 'POST',
      body: JSON.stringify(registrationData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 422) {
          throw new Error('Validation error');
        } else {
          throw new Error('Registration failed');
        }
      })
      .then((data) => {
        // Registration successful, handle the response if needed
        console.log(data);

        // Redirect the user to the desired page
        router.push(`/login?register-success=true`);
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="corporationName">Professional Corporation Name:</label>
          <input type="text" id="corporationName" value={professionalCorporationName} onChange={(e) => setProfessionalCorporationName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="personInCharge">Name of Person in Charge:</label>
          <input type="text" id="personInCharge" value={personInCharge} onChange={(e) => setPersonInCharge(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="squareOneMembersId">Square One Members ID:</label>
          <input type="text" id="squareOneMembersId" value={squareOneMembersId} onChange={(e) => setSquareOneMembersId(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
