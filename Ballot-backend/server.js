require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(bodyParser.json()); // Parses incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data

// Serve static files (for uploaded media if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connection to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// routes
const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issue');

app.use('/api/auth', authRoutes);   // Authentication routes
app.use('/api/issues', issueRoutes); // Issue routes


app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
