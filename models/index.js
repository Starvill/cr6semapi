const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

const Item = sequelize.define('item', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  startingBid: Sequelize.INTEGER,
  currentBid: Sequelize.INTEGER,
  bidStep: Sequelize.INTEGER,
  startBidTime: Sequelize.DATE,
  endBidTime: Sequelize.DATE,
  imagePath: Sequelize.STRING,
});

const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: Sequelize.STRING,
  isAdmin: Sequelize.BOOLEAN,
});

const TransacHist = sequelize.define('transacHist', {
  bid: Sequelize.INTEGER,
  bidDate: Sequelize.DATE,
});

// Associations
TransacHist.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(TransacHist, { foreignKey: 'user_id' });

Item.belongsTo(User, { foreignKey: 'user_id' }); // Seller association
User.hasMany(Item, { foreignKey: 'user_id' });

// New association between Item and User for winner
Item.belongsTo(User, { as: 'winner', foreignKey: 'win_id' });
User.hasMany(Item, { as: 'wonItems', foreignKey: 'win_id' });

// Association between Item and TransacHist
TransacHist.belongsTo(Item, { foreignKey: 'item_id' });
Item.hasMany(TransacHist, { foreignKey: 'item_id' });

module.exports = {
  sequelize,
  Item,
  User,
  TransacHist,
};
