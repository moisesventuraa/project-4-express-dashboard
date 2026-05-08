const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve frontend files
app.use(express.static(path.join(__dirname)));

app.get('/profile.html', (req, res) => {
  res.redirect('/');
});

// Environment variable
const greeting =
  process.env.GREETING || 'Welcome to my dashboard API!';

// Mock task data
let items = [
  {
    id: 1,
    title: 'Finish Project 4',
    category: 'School'
  },
  {
    id: 2,
    title: 'Study Express.js',
    category: 'Coding'
  }
];

// GET endpoint
app.get('/api/items', (req, res) => {
  res.json({
    message: greeting,
    items: items
  });
});

// POST endpoint
app.post('/api/items', (req, res) => {
  const { title, category } = req.body;

  if (!title || !category) {
    return res.status(400).json({
      error: 'Both title and category are required.'
    });
  }

  const newItem = {
    id: items.length + 1,
    title,
    category
  };

  items.push(newItem);

  res.status(201).json({
    message: 'Item added successfully!',
    item: newItem
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }

  console.log(`Server running on port ${PORT}`);
});
