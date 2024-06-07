const express = require('express');
const router = express();
const { Item } = require('../models');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './static/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
router.use(express.json());
router.use(express.static(path.join(__dirname, 'static')));

// Получение всех предметов
router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/won/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const wonItems = await Item.findAll({
      where: {
        win_id: userId,
        endBidTime: {
          [Sequelize.Op.lt]: time
        }
      }
    });
    res.status(200).json(wonItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByPk(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const items = await Item.findAll({ where: { user_id } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Создание нового предмета
router.post('/', upload.single('image'), authenticateToken, async (req, res) => {
  try {
    const imagePath = req.file.filename;
    const { title, description, startingBid, currentBid, bidStep ,startBidTime, endBidTime } = req.body;
    const user_id =  req.body.user_id;
    const newItem = await Item.create({ title, description, startingBid, currentBid, bidStep ,startBidTime, endBidTime, imagePath, user_id});
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Обновление предмета
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      const { title, description, startingBid, currentBid, bidStep, startBidTime, endBidTime, win_id} = req.body;
      await item.update({ title, description, startingBid, currentBid, bidStep, startBidTime, endBidTime, win_id});
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});





// Удаление предмета
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!req.user.isAdmin) {
      return res.sendStatus(403);
    }
    if (item) {
      await item.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
