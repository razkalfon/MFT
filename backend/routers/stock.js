import express from 'express';
import { plcuurentsymbol, calculateProfitLossSold } from '../stocks/calculators.js';
import User from '../models/auth.js';

const router = express.Router();

router.get('/get_stocksHistory/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid user ID');
    }
    res.status(200).json(user.stockHistorySchema);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

router.get('/get_listStocks/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid user ID');
    }
    res.status(200).json(user.listStockSchema);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

router.put('/sell_stock/:email', async (req, res) => {
  const { datesell, closeprice, symbol, quantity } = req.body;
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid user ID');
    }

    const stockIndex = user.listStockSchema.findIndex(stock => stock.symbol === symbol);
    if (stockIndex === -1) {
      return res.status(404).send(`Stock ${symbol} not found in user's stocks.`);
    }

    const stock = user.listStockSchema[stockIndex];

    if (quantity <= stock.quantity) {
      const pldaily = calculateProfitLossSold(stock.openPrice, closeprice, quantity);
      const soldStock = {
        datesell,
        closeprice,
        symbol,
        quantity,
        pldaily
      };
      
      stock.quantity -= quantity;
      if (stock.quantity === 0) {
        user.listStockSchema.splice(stockIndex, 1);
      } else {
        stock.pldaily = await plcuurentsymbol(stock.symbol, stock.openPrice, stock.quantity);
      }
      
      user.stockHistorySchema.push(soldStock);
      await user.save();
      
      res.status(200).json(soldStock);
    } else {
      res.status(400).send('Invalid quantity');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

router.post('/buy_stock/:email', async (req, res) => {
  const { datebuy, openPrice, symbol, quantity } = req.body;
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid user ID');
    }

    let stockFound = false;
    for (const stock of user.listStockSchema) {
      if (stock.symbol === symbol) {
        const avg = quantity + stock.quantity;
        const average_open_price = ((quantity / avg) * openPrice) + ((stock.quantity / avg) * stock.openPrice);
        stock.openPrice = average_open_price;
        stock.quantity += quantity;
        stock.pldaily = await plcuurentsymbol(symbol, stock.openPrice, stock.quantity);
        stockFound = true;
        break;
      }
    }

    if (!stockFound) {
      const pldaily = await plcuurentsymbol(symbol, openPrice, quantity);

      const newStock = {
        datebuy,
        openPrice,
        symbol,
        quantity,
        pldaily
      };

      user.listStockSchema.push(newStock);
    }

    await user.save();
    res.status(201).json(user.listStockSchema);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



export default router;
