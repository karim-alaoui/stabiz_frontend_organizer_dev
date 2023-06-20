import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  interface ProfileData {
    professional_corporation_name: string;
    name_of_person_in_charge: string;
    email: string;
    phone_number: string;
    square_one_members_id: string;
  }
  
  const [profileData, setProfileData] = useState<ProfileData>({
    professional_corporation_name: '',
    name_of_person_in_charge: '',
    email: '',
    phone_number: '',
    square_one_members_id: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('organizer-token');

      if (!token) {
        router.push('/login'); // Redirect to login page if token is not found
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/organizer/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData: ProfileData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('organizer-token');

    if (!token) {
      router.push('/login'); // Redirect to login page if token is not found
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/organizer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        router.push('/?profile-update-success'); // Redirect to home page with success message
      } else {
        console.error('Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleEditPassword = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/organizer/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: profileData.email }),
      });
  
      if (response.ok) {
        router.push(`/edit-password?email=${profileData.email}`);
      } else {
        // Handle error response here
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      // Handle fetch error here
      console.log('Error:', error);
    }
  };
  
  return (
    <div>
      <Header />
      <div>
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="professional_corporation_name">Professional Corporation Name</label>
            <input
              type="text"
              id="professional_corporation_name"
              name="professional_corporation_name"
              value={profileData.professional_corporation_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="name_of_person_in_charge">Name of Person in Charge</label>
            <input
              type="text"
              id="name_of_person_in_charge"
              name="name_of_person_in_charge"
              value={profileData.name_of_person_in_charge}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="name_of_person_in_charge">Name of Person in Charge</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={profileData.phone_number}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="square_one_members_id">Square One Members ID</label>
            <input
              type="text"
              id="square_one_members_id"
              name="square_one_members_id"
              value={profileData.square_one_members_id}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Edit</button>
        </form>
        <button onClick={handleEditPassword}>Edit Password</button>
      </div>
    </div>
  );
};

export default EditProfilePage;
