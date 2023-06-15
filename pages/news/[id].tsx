import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';

const IndexPage: React.FC = () => {
  const router = useRouter();
  const [newsData, setNewsData] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any>(null);

  useEffect(() => {
    const fetchNewsList = async () => {
      const token = localStorage.getItem('organizer-token');

      if (!token) {
        router.push('/login'); // Redirect to login page if token is not found
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/news-topic', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setNewsData(data.data);
      } catch (error) {
        console.error('Error fetching news list:', error);
      }
    };
    fetchNewsList();
  }, []);

  useEffect(() => {
    const { id } = router.query;
    const selectedNews = newsData.find((news: any) => news.id === Number(id));
    setSelectedNews(selectedNews);
  }, [router.query, newsData]);

  const goToPreviousNews = () => {
    const currentIndex = newsData.findIndex((news: any) => news.id === selectedNews.id);
    const previousIndex = currentIndex + 1;
    if (previousIndex >= 0) {
      const previousNews = newsData[previousIndex];
      setSelectedNews(previousNews);
    }
  };

  const goToNextNews = () => {
    const currentIndex = newsData.findIndex((news: any) => news.id === selectedNews.id);
    const nextIndex = currentIndex - 1;
    if (nextIndex < newsData.length) {
      const nextNews = newsData[nextIndex];
      setSelectedNews(nextNews);
    }
  };

  return (
    <div>
      <Header />
      <div>
        {selectedNews && (
          <div>
            <h3>{selectedNews.title}</h3>
            <p>Created At: {new Date(selectedNews.created_at).toLocaleDateString('en-US')}</p>
            <p>{selectedNews.body}</p>
          </div>
        )}
        <div>
          <button onClick={goToPreviousNews} disabled={!selectedNews || selectedNews.id === newsData[newsData.length - 1].id}>
            Previous News
          </button>
          <button
            onClick={goToNextNews}
            disabled={!selectedNews || selectedNews.id === newsData[0].id}
          >
            Next News
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
