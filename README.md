# Sendpulse ↔ Bitrix24 Open Channels Bridge

This service provides a minimal HTTP API to connect Sendpulse Messaging events to Bitrix24 Open Channels. It exposes endpoints for:

- Registering a Bitrix24 Open Channel connector.
- Sending messages into Bitrix24 Open Channels.
- Creating CRM leads in Bitrix24.
- Receiving Sendpulse webhook events and forwarding them to Bitrix24.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`) and update the URLs if needed.

```bash
cp .env.example .env
```

3. Start the server:

```bash
npm start
```

The server listens on `http://localhost:3000` by default.

## API endpoints

### `POST /bitrix24/register`
Send the payload expected by `imconnector.register`.

### `POST /bitrix24/send-message`
Send the payload expected by `imconnector.send.messages`.

### `POST /bitrix24/create-lead`
Send the payload expected by `crm.lead.add`.

### `POST /webhooks/sendpulse`
Receives Sendpulse webhook events, then forwards a simplified payload to Bitrix24 Open Channels. The `openChannelId` is set from `BITRIX24_OPEN_CHANNEL_ID` (defaults to `7`). If you set `SENDPULSE_WEBHOOK_SECRET`, the endpoint checks for a matching `x-sendpulse-signature` header.

## Next steps

- Map Sendpulse webhook payloads to Bitrix24 Open Channels format.
- Store message/contact mappings for inbound/outbound routing.
- Add persistence for connector and channel configuration.
