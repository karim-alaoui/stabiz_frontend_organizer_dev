"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '../styles/MainPage.module.css';
import Header from '../components/Header';

const MainPage: React.FC = () => {
  const [newsData, setNewsData] = useState([]);
  const [founderProfilesData, setFounderProfilesData] = useState([]);
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
                  <button>News Detail</button>
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
                      <td><button>権限付与</button></td>
                      <td><button>プロフィール詳細</button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainPage;
