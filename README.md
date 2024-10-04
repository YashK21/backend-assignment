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
Response : 
```json
{
  "name": "AAPL (Apple)",
  "price": 105
}

