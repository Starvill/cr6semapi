const express = require('express');
const { TransacHist, User, Item } = require('../models');
const router = express();

// Create a new transaction history record
router.post('/', async (req, res) => {
  try {
    const { bid, bidDate, user_id, item_id } = req.body;
    const newTransacHist = await TransacHist.create({ bid, bidDate, user_id, item_id });
    res.status(201).json(newTransacHist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all transaction history records
router.get('/', async (req, res) => {
  try {
    const transacHists = await TransacHist.findAll({ include: [User, Item] });
    res.status(200).json(transacHists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read a single transaction history record by ID
router.get('/:id', async (req, res) => {
  try {
    const transacHist = await TransacHist.findByPk(req.params.id, { include: [User, Item] });
    if (transacHist) {
      res.status(200).json(transacHist);
    } else {
      res.status(404).json({ error: 'Transaction history not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Update a transaction history record by ID
router.put('/:id', async (req, res) => {
  try {
    const { bid, bidDate, user_id, item_id } = req.body;
    const [updated] = await TransacHist.update({ bid, bidDate, user_id, item_id }, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedTransacHist = await TransacHist.findByPk(req.params.id);
      res.status(200).json(updatedTransacHist);
    } else {
      res.status(404).json({ error: 'Transaction history not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a transaction history record by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TransacHist.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Transaction history not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
