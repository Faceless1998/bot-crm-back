const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb+srv://kakhiweinrooneykakhidze:Godlovesme98.@cluster0.w8eaf1y.mongodb.net/telegram_bot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  username: String,
  first_name: String,
  last_name: String,
  user_id: Number,
  status: Boolean,
  trial_end_date: Date
});

const User = mongoose.model('User', UserSchema);

app.use(cors());
app.use(bodyParser.json());

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user status
app.put('/users/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user status
    if (status !== undefined) {
      user.status = status;

      // If activating the user, set trial_end_date to 30 days from today at midnight
      if (status) {
        const today = new Date();
        const newDate = new Date(today);
        newDate.setDate(today.getUTCDate() + 30);
        newDate.setHours(today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds()); // Set to midnight
        console.log('New trial end date:', newDate); // Debugging output
        user.trial_end_date = newDate;
      }
    }

    // Save the updated user
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
