const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads')); // Adjust the path to the uploads folder
  },
  filename: function (req, file, cb) {
    const { email, firstName, lastName } = req.body;
    const imageCount = Object.keys(req.files).length;
    const imageNumber = (imageCount <= 4 && imageCount >= 2) ? imageCount : ''; // Empty if not within range
    const fileName = `${email}-${firstName}-${lastName}-${imageNumber}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// Serve static files (HTML, CSS, images, etc.)
app.use(express.static(path.join(__dirname, '..'))); // Serve static files from the root directory

// Define route handler for the root URL to serve index.html
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'index.html')); // Send index.html from the root directory
});

// ... (Code for handling form submissions and serving contest entries)
// Store uploaded images and user details
const contestEntries = []; // Placeholder to simulate storing image data

// Handle form submissions
app.post('/submit', upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }]), function (req, res) {
  const { firstName, lastName, email } = req.body;
  const imageFiles = Object.values(req.files).map(fileArray => fileArray.map(file => file.filename)).flat();

  // Store image details along with the user's name
  const userFullName = `${firstName} ${lastName}`;
  imageFiles.forEach(image => {
    const entry = {
      imageSrc: `/uploads/${image}`,
      uploadedBy: userFullName,
      // Add more properties or details if required
    };
    contestEntries.push(entry);
  });

  // Send a success message as a response (remove the redirect)
  res.send('Submission successful!'); // Placeholder response
});

// Serve contest entries data to the next page
app.get('/contestEntries', function(req, res) {
  res.json(contestEntries);
});

// For other routes, serve index.html to enable client-side routing
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
const port = 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
