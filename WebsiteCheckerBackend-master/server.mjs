import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
  res.send("Welcome to the home page");
})

app.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query; // Get the URL from the query parameters
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is missing' });
    }

    const response = await fetch(url, { method: 'HEAD' });
    const data = {
      status: response.status,
      statusText: response.statusText,
    };
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Node.js server is running on port ${port}`);
});
