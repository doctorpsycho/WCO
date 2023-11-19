const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const { email, firstName, lastName } = req.body;
    const imageCount = Object.keys(req.files).length;
    // Ensure the number of images uploaded is within the specified range (2-4)
    const imageNumber = (imageCount <= 4 && imageCount >= 2) ? imageCount : ''; // Empty if not within range
    const fileName = `${email}-${firstName}-${lastName}-${imageNumber}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// Serve static files (HTML, CSS, images, etc.)
app.use(express.static(__dirname));

// Handle form submissions
app.post('/submit', upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }]), function (req, res) {
  const { firstName, lastName, email } = req.body;
  const imageFiles = Object.values(req.files).map(fileArray => fileArray.map(file => file.filename)).flat();

  // Placeholder: Store image files in a database or perform other necessary operations
  // You can save the uploaded image filenames or their paths in a database here

  // Redirect to the next HTML page
  res.redirect('/next.html');
});

// Start the server
const port = 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});

// Function to get a list of image files in the 'uploads' folder
function getImageFiles() {
  return new Promise((resolve, reject) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const imageFiles = files.filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()));
        resolve(imageFiles);
      }
    });
  });
}

// This function will be called by the client to get the updated image list
app.get('/getImages', async (req, res) => {
  try {
    const images = await getImageFiles();
    res.json(images);
  } catch (error) {
    console.error('Error reading image files:', error);
    res.status(500).send('Error reading image files');
  }
});
