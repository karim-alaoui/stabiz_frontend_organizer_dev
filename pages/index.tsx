"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import styles from '../styles/MainPage.module.css';
import Header from '../components/Header';

// Set the app element to the root of your application
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

const MainPage: React.FC = () => {
  const [newsData, setNewsData] = useState([]);
  const [founderProfilesData, setFounderProfilesData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Add modal state
  const [founderUsersData, setFounderUsersData] = useState([]); // Add founder users state
  const [selectedFounderProfile, setSelectedFounderProfile] = useState(null); // Add selected founder profile state
  const [editModalIsOpen, setEditModalIsOpen] = useState(false); // Add edit modal state
  const [selectedUser, setSelectedUser] = useState<any>(null); // Explicitly set the type as 'any' // Add selected user state
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('organizer-token');

        if (!token) {
          router.push('/login'); // Redirect to login page if token is not found
          return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const newsResponse  = await axios.get('http://localhost:8000/api/v1/news-topic');
        setNewsData(newsResponse.data.data);

        const founderProfilesResponse = await axios.get('http://localhost:8000/api/v1/organizer/founder-profiles');
        setFounderProfilesData(founderProfilesResponse.data);
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };

    fetchData();
  }, [router]);

  const handleNewsDetail = (id: number) => {
    router.push(`/news/${id}`);
  };

  const handleOpenModal = (founderProfile : any) => {
    setSelectedFounderProfile(founderProfile);
    setModalIsOpen(true);
    fetchFounderUsers(founderProfile.id); // Fetch founder users for the selected founder profile
  };

  const handleCloseModal = () => {
    setSelectedFounderProfile(null);
    setModalIsOpen(false);
  };

  const handleOpenEditModal = (user : any) => {
    setSelectedUser(user);
    setEditModalIsOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedUser(null); // Reset selectedUser when closing the modal
    setEditModalIsOpen(false);
  };

  const fetchFounderUsers = async (founderProfileId : any) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/organizer/founder-profiles/${founderProfileId}/founder-users`);
      setFounderUsersData(response.data.founder_users);
    } catch (error) {
      console.error('Error fetching founder users:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <nav className={styles.nav}>Left Navigation Bar</nav>
        <main className={styles.main}>
          <div className={styles.newsContainer}>
            <button className={styles.scrollButton}>{"<"}</button>
            <div className={styles.news}>
              {newsData.map((news: any) => (
                <div key={news.id} className={styles.newsItem}>
                  <h3>{news.title}</h3>
                  <p>{news.body}</p>
                  <p>Created At: {new Date(news.created_at).toLocaleDateString('en-US')}</p>
                  <button onClick={() => handleNewsDetail(news.id)}>News Detail</button>
                </div>
              ))}
            </div>
            <button className={styles.scrollButton}>{">"}</button>
          </div>
          <div className={styles.founders}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>会 社 名</th>
                  <th>エリア</th>
                  <th>業 種</th>
                  <th>マ ッ チ 数</th>
                  <th>権限付与</th>
                  <th>詳細</th>
                </tr>
              </thead>
              <tbody>
                {founderProfilesData &&
                  founderProfilesData.map((founder: any) => (
                    <tr key={founder.id}>
                      <td>{founder.company_name}</td>
                      <td>{founder.area.name_ja}</td>
                      <td>{founder.industries.map((industry: any) => industry.name).join(', ')}</td>
                      <td>{founder.no_of_employees}</td>
                      <td>
                        <button onClick={() => handleOpenModal(founder)}>権限付与</button>
                      </td>
                      <td><button>プロフィール詳細</button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal}>
        <h2>権限付与</h2>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Detail</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {founderUsersData.map((founderUser : any) => (
              <tr key={founderUser.id}>
                <td>{founderUser.first_name}</td>
                <td>{founderUser.last_name}</td>
                <td>
                  <button onClick={() => handleOpenEditModal(founderUser)}>Detail</button>
                </td>
                <td>
                  {founderUser.role === 'readonly' && <span>Read Only</span>}
                  {founderUser.role === 'readwrite' && <span>Read and Write</span>}
                  {founderUser.role === 'expired' && <span>Disabled</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleCloseModal}>閉じる</button>
        <button>便新</button>
      </Modal>
      <Modal isOpen={editModalIsOpen} onRequestClose={handleCloseEditModal}>
        {selectedUser && (
          <div>
            <h2>Edit User Details</h2>
            <form>
              <label>
                First Name:
                <input
                  type="text"
                  value={selectedUser.first_name}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      first_name: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={selectedUser.last_name}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      last_name: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Email:
                <input
                  type="text"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      email: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Role:
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="readonly" selected={selectedUser.role === "readonly"}>
                    Read Only
                  </option>
                  <option value="readwrite" selected={selectedUser.role === "readwrite"}>
                    Read and Write
                  </option>
                  <option value="expired" selected={selectedUser.role === "expired"}>
                    Disabled
                  </option>
                </select>
              </label>
            </form>
            <button onClick={handleCloseEditModal}>Close</button>
            <button>Apply</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MainPage;
