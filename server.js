const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://kakhiweinrooneykakhidze:Godlovesme98.@cluster0.w8eaf1y.mongodb.net/telegram_bot";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  username: String,
  first_name: String,
  last_name: String,
  user_id: Number,
  status: String,
  date: Date,
  trial_end_date: Date,
});

const User = mongoose.model('User', userSchema);

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
