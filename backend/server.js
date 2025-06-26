const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(() => console.log('✅ MongoDB Atlas Connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(express.json());
app.use(cors());

const transactionSchema = new mongoose.Schema({
    title: String,
    amount: Number
});
const Transaction = mongoose.model('Transaction', transactionSchema);

app.get('/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.json(transactions);
});

app.post('/transactions', async (req, res) => {
    const { title, amount } = req.body;
    const transaction = new Transaction({ title, amount });
    await transaction.save();
    res.json(transaction);
});

app.delete('/transactions/:id', async (req, res) => {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
