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

## Deploy on Hostinger with your domain

These steps assume a Hostinger VPS (Ubuntu) so you can run a Node.js service. If you are using shared hosting, you’ll need Node.js support (or deploy to a VPS instead).

1. **Point your domain to the VPS**
   - In your domain’s DNS settings, create an `A` record for `demo.noqtatain.com` pointing to your VPS public IP.

2. **Install Node.js on the VPS**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Upload the project**
   ```bash
   git clone <your-repo-url>
   cd sendpulse-bitrix24-connector
   npm install
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env to set your URLs and optional SENDPULSE_WEBHOOK_SECRET
   ```

5. **Run the service with PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start src/index.js --name sendpulse-bitrix24-bridge
   pm2 startup
   pm2 save
   ```

6. **Add an Nginx reverse proxy for your domain**
   ```bash
   sudo apt-get install -y nginx
   ```

   Create `/etc/nginx/sites-available/sendpulse-bitrix24`:
   ```nginx
   server {
     listen 80;
     server_name demo.noqtatain.com;

     location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

   Enable the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/sendpulse-bitrix24 /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **(Optional) Add HTTPS with Let’s Encrypt**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d demo.noqtatain.com
   ```

8. **Use your domain in Sendpulse**
   - Set the Sendpulse webhook URL to `https://demo.noqtatain.com/webhooks/sendpulse`.
   - In Sendpulse, create a webhook subscription (Messaging → Integrations/Webhooks) pointing to the URL above and select the events you want forwarded into Bitrix24.

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
