import express from 'express';
import Stock from '../models/stock.js'; 
import { plcuurentsymbol } from '../stocks/calculators.js';
import User from '../models/auth.js';

const router = express.Router();

router.put('/sell_stock/:email', async (req, res) => {
  const { closePrice, symbol, quantity } = req.body;
  const { email } = req.params; // קבלת כתובת המייל מהנתיב

  try {
    const user = await User.findOne({ email }); // חיפוש המשתמש לפי כתובת המייל
    if (!user) { 
      return res.status(400).send('Invalid user ID');
    }

    let stockFound = false;
    for (const stock of user.listStockSchema) {
      if (stock.symbol === symbol) {
        stockFound = true;
        if (quantity < stock.quantity) {
          stock.quantity -= quantity;
          await stock.save();
          return res.status(200).send(`Stock ${symbol} quantity updated: ${stock.quantity}`);
        } else if (quantity === stock.quantity) {
          await Stock.findOneAndRemove({ _id: stock._id }); // מחיקת המניה מהמסד כאשר הכמות זהה לכמות ברשות המשתמש
          return res.status(200).send(`Stock ${symbol} deleted successfully.`);
        }
      }
    }

    if (!stockFound) {
      return res.status(400).send('Invalid symbol');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Internal Server Error');
  }  
});

router.post('/buy_stock/:email', async (req, res) => {
  const { datebuy, openPrice, symbol, quantity } = req.body;
  const { email } = req.params; // קבלת כתובת המייל מהנתיב

  let pldaily = await plcuurentsymbol(symbol, openPrice, quantity);

  try {
    const user = await User.findOne({ email }); // חיפוש המשתמש לפי כתובת המייל
    if (!user){ 
      return res.status(400).send('Invalid user ID');
    }

    // יצירת המניה במסד הנתונים
    const newStock = await Stock.create({
      datebuy,
      openPrice,
      symbol,
      quantity,
      pldaily
    });
    
    // הוספת המניה לרשימת המניות של המשתמש
    user.listStockSchema.push(newStock);
    user.stockHistorySchema.push(newStock);
    await user.save();

    // החזרת המניה החדשה כתשובה לפנייה
    res.status(201).json(newStock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
