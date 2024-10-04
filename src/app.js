import express from 'express';
import bodyParser from 'body-parser';
import stockRoutes from './routes/stock.routes.js';
import { runTradingLogic } from './controllers/stockprice.controller.js';

const app = express();
app.use(bodyParser.json());

// Use stock routes
app.use('/api/stocks', stockRoutes);

// Start trading logic
runTradingLogic();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
