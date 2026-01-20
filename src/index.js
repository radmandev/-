import express from 'express';
import { assertBitrixConfig, config } from './config.js';
import {
  createLead,
  registerConnector,
  sendOpenChannelMessage
} from './bitrix24.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/bitrix24/register', async (req, res) => {
  try {
    assertBitrixConfig();
    const result = await registerConnector(req.body);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/bitrix24/send-message', async (req, res) => {
  try {
    assertBitrixConfig();
    const result = await sendOpenChannelMessage(req.body);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/bitrix24/create-lead', async (req, res) => {
  try {
    assertBitrixConfig();
    const result = await createLead(req.body);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/webhooks/sendpulse', async (req, res) => {
  try {
    const secret = config.sendpulseWebhookSecret;
    if (secret && req.headers['x-sendpulse-signature'] !== secret) {
      return res.status(401).json({ ok: false, error: 'Invalid signature' });
    }

    assertBitrixConfig();

    const { message, contact, channel } = req.body || {};
    const openChannelPayload = {
      channel: channel || 'sendpulse',
      openChannelId: config.bitrix24.openChannelId,
      message: {
        text: message?.text || 'New Sendpulse message received',
        attachments: message?.attachments || []
      },
      contact: contact || {}
    };

    const result = await sendOpenChannelMessage(openChannelPayload);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(config.port, () => {
  console.log(`Sendpulse ↔ Bitrix24 bridge listening on ${config.port}`);
});
