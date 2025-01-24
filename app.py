from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
import requests
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
import numpy as np

app = Flask(__name__)
CORS(app)

API_KEY = ""  # Replace with your Alpha Vantage API key


def fetch_stock_data_from_api(symbol):
    base_url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "apikey": API_KEY,
        "outputsize": "full",
        "datatype": "json",
    }
    response = requests.get(base_url, params=params)
    data = response.json()

    if "Time Series (Daily)" in data:
        daily_data = data["Time Series (Daily)"]
        df = pd.DataFrame.from_dict(daily_data, orient="index")
        df.index.name = "Date"
        df.columns = ["Open", "High", "Low", "Close", "Volume"]
        df = df.sort_index(ascending=True)  
        df.to_csv(f"{symbol}_daily.csv") 
        return df
    else:
        raise Exception(data.get("Note") or data.get("Error Message", "Unknown error"))

@app.route("/api/stock-data/<symbol>", methods=["GET"])
def get_stock_data(symbol):
    symbol = symbol.upper()
    try:
     
        csv_file = f"{symbol}_daily.csv"
        if os.path.exists(csv_file):
            df = pd.read_csv(csv_file)
        else:
         
            df = fetch_stock_data_from_api(symbol)

        # Return data as JSON
        return jsonify(df.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/predict/<symbol>", methods=["GET"])
def predict_stock(symbol):
    symbol = symbol.upper()
    try:
  
        csv_file = f"{symbol}_daily.csv"
        if not os.path.exists(csv_file):
        
            fetch_stock_data_from_api(symbol)

        df = pd.read_csv(csv_file)
        df['Date'] = pd.to_datetime(df['Date'])
        df['Timestamp'] = df['Date'].map(pd.Timestamp.timestamp)

        X = df['Timestamp'].values.reshape(-1, 1)
        y = df['Close'].values

        algorithms = {
            "Linear Regression": LinearRegression(),
            "Ridge Regression": Ridge(alpha=1.0),
            "Lasso Regression": Lasso(alpha=0.01),
            "Decision Tree": DecisionTreeRegressor(),
            "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42),
        }

        predictions = {}
        for name, model in algorithms.items():
            model.fit(X, y)
            predictions[name] = model.predict(X).tolist()

        future_dates = pd.date_range(df['Date'].max(), periods=31, freq='B')[1:]
        future_timestamps = future_dates.map(pd.Timestamp.timestamp).values.reshape(-1, 1)

        future_predictions = {}
        for name, model in algorithms.items():
            future_predictions[name] = model.predict(future_timestamps).tolist()

        for name, pred in predictions.items():
            df[name] = pred

        user_df = pd.DataFrame(future_predictions)
        user_df['Date'] = future_dates
        user_df.set_index('Date', inplace=True)
        user_df.to_csv('user.csv') 

   
        return jsonify({
            'historical_data': df.to_dict(orient="records"),
            'predictions': future_predictions,
            'future_dates': future_dates.tolist()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
