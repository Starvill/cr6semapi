const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const itemRouter = require('./routes/items');
const authRouter = require('./routes/auth');
const transacHistRouter = require('./routes/transacHist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/items', itemRouter);
app.use('/auth', authRouter);
app.use('/transacHists', transacHistRouter);
app.use('/static', express.static('static')); 

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});