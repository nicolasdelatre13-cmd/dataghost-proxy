const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = process.env.TARGET_API_URL;
const API_KEY = process.env.TARGET_API_KEY;

app.get('/check', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email requis' });

          try {
                const response = await fetch(
                        `${API_URL}/check?email=${encodeURIComponent(email)}`,
                  {
                            headers: {
                                        'X-API-Key': API_KEY,
                                        'Content-Type': 'application/json',
                                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                                        'Accept': 'application/json, text/plain, */*',
                                        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
                                        'Accept-Encoding': 'gzip, deflate, br',
                                        'Connection': 'keep-alive',
                                        'Cache-Control': 'no-cache',
                                        'Pragma': 'no-cache',
                                        'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124"',
                                        'sec-ch-ua-mobile': '?0',
                                        'sec-ch-ua-platform': '"Windows"',
                                        'Sec-Fetch-Dest': 'empty',
                                        'Sec-Fetch-Mode': 'cors',
                                        'Sec-Fetch-Site': 'same-origin'
                            }
                  }
                      );

      const text = await response.text();

      if (response.status === 403) {
              return res.status(403).json({ error: 'Cloudflare challenge', raw: text.slice(0, 200) });
      }

      try {
              const data = JSON.parse(text);
              res.json(data);
      } catch {
              res.status(500).json({ error: 'Reponse non JSON', raw: text.slice(0, 200) });
      }

          } catch (err) {
                res.status(500).json({ error: 'Erreur proxy', details: err.message });
          }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
