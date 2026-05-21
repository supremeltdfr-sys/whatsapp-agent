require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const { handleIncomingMessage } = require('./agent');

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    return res.status(200).send(req.query['hub.challenge']);
  }
  res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];
    if (!message || message.type !== 'text') return res.sendStatus(200);
    res.sendStatus(200);
    await handleIncomingMessage(message.from, value?.contacts?.[0]?.profile?.name || 'Client', message.text.body);
  } catch (e) { console.error(e); res.sendStatus(500); }
});

app.get('/', (req, res) => res.json({ status: 'ok' }));
app.listen(process.env.PORT || 3000, () => console.log('Agent demarre'));
