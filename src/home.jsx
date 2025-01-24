import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const StockNews = ({ ticker }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/api/news-analysis?ticker=${ticker}`);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (ticker) {
      fetchData();
    }
  }, [ticker]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Stock News for {data.ticker}</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <strong>Sentiment:</strong> {data.sentiment}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Average Sentiment:</strong> {data.average_sentiment.toFixed(2)}
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Trending Keywords</h3>
        <div className="flex gap-2 flex-wrap">
          {data.trending_keywords.map((keyword, index) => (
            <span key={index} className="bg-gray-100 text-sm px-2 py-1 rounded">
              {keyword}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Articles</h3>
        <ul className="space-y-2">
          {data.articles.map((article, index) => (
            <li key={index} className="p-3 bg-gray-50 border rounded">
              <a
                href={article.urlToImage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-medium hover:underline"
              >
                {article.Title}
              </a>
              <p className="text-sm text-gray-600">Sentiment: {article.Sentiment > 0 ? "Positive" : article.Sentiment < 0 ? "Negative" : "Neutral"}</p>
              <p className="text-sm text-gray-600">Published Date: {article.Dates}</p>
              <p className="text-sm text-gray-500">{article.Description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


// Home Component
function Home() {
  const [stockSymbol, setStockSymbol] = useState("");
  const [dates, setDates] = useState([]);
  const [closePrices, setClosePrices] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [futureDates, setFutureDates] = useState([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState({
    "Linear Regression": true,
    "Ridge Regression": false,
    "Lasso Regression": false,
    "Decision Tree": false,
    "Random Forest": false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStockData = (symbol) => {
    setErrorMessage(""); 
    setLoading(true); 
    axios
      .get(`http://127.0.0.1:5000/api/predict/${symbol}`)
      .then((response) => {
        const data = response.data;
        const historicalData = data.historical_data;
        const futureDates = data.future_dates;
        const predictions = data.predictions;

        setDates(historicalData.map((item) => item["Date"]));
        setClosePrices(historicalData.map((item) => item["Close"]));
        setPredictions(predictions);
        setFutureDates(futureDates);
        setLoading(false); 
      })
      .catch((error) => {
        setErrorMessage("Failed to fetch stock data. Please try again.");
        console.error("Error fetching stock data:", error);
        setLoading(false); 
      });
  };

  const handleFetch = () => {
    if (stockSymbol.trim() !== "") {
      fetchStockData(stockSymbol.trim().toUpperCase());
    } else {
      setErrorMessage("Please enter a valid stock symbol.");
    }
  };

  const toggleAlgorithmSelection = (algorithm) => {
    setSelectedAlgorithms((prev) => ({
      ...prev,
      [algorithm]: !prev[algorithm],
    }));
  };

  const renderPredictionTraces = () => {
    return Object.keys(predictions)
      .filter((algorithm) => selectedAlgorithms[algorithm])
      .map((algorithm) => ({
        x: futureDates,
        y: predictions[algorithm],
        type: "scatter",
        mode: "lines+markers",
        name: `${algorithm} (Predicted)`,
      }));
  };

  const todayDate = new Date();


  const todayString = todayDate.toLocaleDateString();

  const todayIndex = dates.reduce((closestIndex, currentDate, index) => {
    const currentDateObj = new Date(currentDate);
    const closestDateObj = new Date(dates[closestIndex]);

    const currentDiff = Math.abs(currentDateObj - todayDate);
    const closestDiff = Math.abs(closestDateObj - todayDate);

    return currentDiff < closestDiff ? index : closestIndex;
  }, 0);
  
 
  const todayClosePrice = closePrices[todayIndex];

  const nextWeekPredictions = futureDates.slice(0, 7).map((date, index) => ({
    date,
    prediction: Object.keys(predictions).map((algorithm) => ({
      algorithm,
      price: predictions[algorithm][index],
    })),
  }));

  const isGraphRendered = dates.length > 0 && closePrices.length > 0;

  return (
    <div className="bg-black text-white h-screen flex flex-col">
      <header className="p-4 bg-gray-800">
        <h1 className="text-3xl font-bold">Stock Price Chart</h1>
      </header>

      <div className="flex flex-grow">
        <aside className="w-1/4 p-4 bg-gray-900">
          <h2 className="text-xl font-semibold mb-4">Stock Ticker</h2>
          <input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL)"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            className="p-2 border rounded mb-4 w-full"
          />
          <button
            onClick={handleFetch}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Fetch Stock Data
          </button>
          <h2 className="text-xl font-semibold mt-8 mb-4">Select Algorithms</h2>
          {Object.keys(selectedAlgorithms).map((algorithm) => (
            <label key={algorithm} className="block text-white">
              <input
                type="checkbox"
                checked={selectedAlgorithms[algorithm]}
                onChange={() => toggleAlgorithmSelection(algorithm)}
                className="mr-2"
              />
              {algorithm}
            </label>
          ))}
        </aside>

        <main className="flex-grow p-4">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {loading ? (
            <p>Loading data...</p>
          ) : (
            dates.length > 0 && (
              <div>
                <Plot
                  data={[{
                    x: dates,
                    y: closePrices,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "blue" },
                    name: "Historical Close Price",
                  },
                  ...renderPredictionTraces()]}
                  layout={{
                    title: `${stockSymbol} Stock Price (Historical & 30-Day Prediction)`,
                    xaxis: { title: "Date" },
                    yaxis: { title: "Price (USD)" },
                  }}
                  style={{ width: "100%", height: "500px" }}
                />
                {todayClosePrice !== null && (
                  <p className="mt-4">
                    Today's closing price for {stockSymbol} is: <strong>${todayClosePrice.toFixed(2)}</strong>
                  </p>
                )}
                <h3 className="mt-4 text-xl font-semibold">Next Week's Predictions</h3>
                {nextWeekPredictions.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {nextWeekPredictions.map((prediction, index) => (
                      <li key={index}>
                        <strong>{prediction.date}:</strong>
                        {prediction.prediction.map((pred) => (
                          <span key={pred.algorithm}>
                            {pred.algorithm}: <strong>${pred.price.toFixed(2)}</strong>{" "}
                          </span>
                        ))}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No predictions available.</p>
                )}
              </div>
            )
          )}
       
          {isGraphRendered && stockSymbol && <StockNews ticker={stockSymbol} />}
        </main>
      </div>

      <footer className="bg-gray-800 text-center p-4">
        <p>&copy; 2025 Stock Price Prediction</p>
      </footer>
    </div>
  );
}

export default Home;
