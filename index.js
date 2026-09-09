import { ghostFetch, ghostFetchCleanup } from 'ghostfetch';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = process.env.TARGET_API_URL;
const API_KEY = process.env.TARGET_API_KEY;

app.get('/check', async (req, res) => {
      const { email } = req.query;
      if (!email) return res.status(400).json({ error: 'Email requis' });

          try {
                  const response = await ghostFetch(
                            `${API_URL}/check?email=${encodeURIComponent(email)}`,
                      {
                                  browser: 'Chrome_131',
                                  headers: {
                                                'X-API-Key': API_KEY,
                                                'Accept': 'application/json'
                                  }
                      }
                          );

        const text = await response.text();
                  try {
                            const data = JSON.parse(text);
                            res.json(data);
                  } catch {
                            res.status(500).json({ error: 'Non JSON', raw: text.slice(0, 300) });
                  }

          } catch (err) {
                  res.status(500).json({ error: 'Proxy error', details: err.message });
          } finally {
                  await ghostFetchCleanup();
          }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Proxy ghostfetch running on port ${PORT}`));
