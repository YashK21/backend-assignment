# Stock Trading Bot Backend

## Overview

This is a simple backend application built using Node.js and Express that simulates a stock trading bot. It allows fetching stock prices, simulating buying and selling stocks, and handling stock data using mock JSON files.

### Features:

- Fetch stock prices for different stocks (Apple, Google, Tesla).
- Simulate buying and selling stocks.
- Uses mock data for stock prices for demonstration purposes.

## Technologies Used:

- **Node.js**
- **Express.js**
- **Mock Data** (Stored in JSON files)

## Endpoints:

### 1. Fetch Stock Price:

- **Endpoint**: `/api/stocks/:stockName/price`
- **Method**: GET
- **Description**: Fetches a random price for the specified stock (`apple`, `google`, `tesla`).

Example:

```bash
GET /api/stocks/apple/price
```
Sample Response :
```json
{
  "name": "AAPL (Apple)",
  "price": 105
}
```
### 2. Get Portfolio Status:
- **Endpoint**: /api/stocks/status
- **Method**:GET
- **Description**: Returns the current balance, portfolio, and total profit/loss of the bot.
```bash
GET /api/stocks/status
```
Sample Response :
```json
{
  "balance": 950,
  "portfolio": {
    "AAPL": {
      "quantity": 2,
      "buyPrice": 100
    },
    "TSLA": {
      "quantity": 1,
      "buyPrice": 95
    }
  },
  "profitLoss": 30
}
```
### 3. Simulate Trading:
- **Endpoint**: /api/stocks/trade
- **Method**: POST
- **Description**: Simulates the trading logic, including buying and selling stocks based on predefined rules (2% price drop for buy, 3% price rise for sell). The trading logic runs every 5 seconds and checks the conditions to execute trades automatically.
```bash
POST /api/stocks/trade
```
Sample Response :
```json
{
  "message": "Trading simulation running. Check the logs for trade execution."
}
```
### 4. Check Trade Logs:
- **Endpoint**: /api/stocks/logs
- **Method**: GET
- **Description**: Returns a log of all executed trades, including buy and sell transactions.
```bash
GET /api/stocks/logs
```
Sample Response :
```json
[
  {
    "stock": "AAPL",
    "action": "buy",
    "quantity": 1,
    "price": 100,
    "timestamp": "2024-10-04T10:00:00Z"
  },
  {
    "stock": "TSLA",
    "action": "sell",
    "quantity": 1,
    "price": 120,
    "timestamp": "2024-10-04T10:05:00Z"
  }
]
```
### Trading Simulation Logic:
#### Buy: The bot automatically buys stocks when the stock price drops by more than 2% from the last buy price.
Sell: The bot sells stocks when the stock price rises by more than 3% from the last buy price.
Forced Sell: Stocks are automatically sold after being held for more than 2 minutes.
Trade Failure: There’s a 10% chance that a trade (buy/sell) fails to simulate real-world conditions.
The trading bot runs every 5 seconds to check if any stock satisfies the buy/sell conditions.

How to Use

**Prerequisites:**
- Node.js (v14.x or higher)
- npm (Node Package Manager)

**Getting Started:**
Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/YashK21/backend-assignment.git
cd backend-assignment
```
**Install dependencies:**
```bash
npm install
```
**Start the application:**
```
npm start
```
**The server will run on localhost:3000.**
### Example Requests in Thunder Client/Postman:

- **Fetching the current price for Apple stock:**

  **Method**: GET  
  **URL**: `http://localhost:3000/api/stocks/apple/price`

- **Fetching the portfolio and profit/loss status:**

  **Method**: GET  
  **URL**: `http://localhost:3000/api/stocks/status`

- **Starting the trading simulation:**

  **Method**: POST  
  **URL**: `http://localhost:3000/api/stocks/trade`

- **Viewing the trade logs:**

  **Method**: GET  
  **URL**: `http://localhost:3000/api/stocks/logs`


**JSON File Structure:**
- Each stock has a corresponding JSON file that contains the stock name and an array of prices. 
- Example for Apple_MOCK_DATA.json:
```json
{
  "name": "AAPL (Apple)",
  "prices": [
    { "price": 105 },
    { "price": 107 },
    { "price": 103 },
    { "price": 91 },
    { "price": 110 }
  ]
}
```
### Notes:
- **Mock Data** : The application uses mock data for stock prices stored in the data folder. To simulate real-world data, these mock files are used for demonstration purposes.
- **Stock Trading Simulation** : This is a simplified simulation that does not connect to real stock exchanges. For real-world use, the mock data would be replaced with live data from stock APIs.