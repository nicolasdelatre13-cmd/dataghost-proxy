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
                                                  'Content-Type': 'application/json'
                                                          }
                                                                }
                                                                    );
                                                                        const data = await response.json();
                                                                            res.json(data);
                                                                              } catch (err) {
                                                                                  res.status(500).json({ error: 'Erreur proxy', details: err.message });
                                                                                    }
                                                                                    });

                                                                                    app.get('/health', (req, res) => res.json({ status: 'ok' }));

                                                                                    const PORT = process.env.PORT || 8080;
                                                                                    app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
