import express from 'express';
import authRouter from "./routers/auth.js";
import stockRouter from "./routers/stock.js";
import contentTodatabase from './utils/dataBaseConnect.js'
const app = express();
const port = 3001;
contentTodatabase();

app.use(express.json()); 

app.use("/api/auth", authRouter);
app.use("/api/stock", stockRouter);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
