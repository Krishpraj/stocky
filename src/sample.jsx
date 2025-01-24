import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockNews = ({ ticker }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/api/news-analysis?ticker=AAPL`);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Stock News Analysis for {data.ticker}</h1>
      <div>
        <h2>Sentiment: {data.sentiment}</h2>
        <h3>Average Sentiment: {data.average_sentiment.toFixed(2)}</h3>
      </div>

      <div>
        <h3>Trending Keywords</h3>
        <ul>
          {data.trending_keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>


      <div>
        <h3>Articles</h3>
        <table border="1">
          <thead>
            <tr>
              <th>Title</th>
              <th>Sentiment Num</th>
              <th>Sentiment</th>
              <th>Description</th>
              <th>Article Date</th>
              <th>URL</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {data.articles.map((article, index) => (
              <tr key={index}>
                <td>{article.Title}</td>
                <td>{article.Sentiment}</td>
                <td>{article.Sentiment > 0 ? 'Positive' : article.Sentiment < 0 ? 'Negative' : 'Neutral'}</td>
                <td>{article.Description}</td>
                <td>{article.Dates}</td>
                <td>{article.urlToImage}</td>
                <td>{article.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockNews;
