const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const app = express();


// configures the multer middleware to handle file uploads in our Node.js backend. 
// The dest option specifies the folder where multer will temporarily store the uploaded files.
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Create a form to send the file to Whisper API
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('model', 'whisper-1');
    form.append('response_format', 'text');

    // Send the audio file to Whisper API
    const whisperResponse = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Extract transcribed text
    const transcribedText = whisperResponse.data.text;
    console.log('Transcribed Text:', transcribedText);

    // Return transcribed text as response
    res.json({ transcribedText });
  } catch (error) {
    console.error('Error transcribing audio:', error.message);
    res.status(500).json({ error: 'Error transcribing audio' });
  } finally {
    // Clean up uploaded file after processing
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err.message);
    });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
