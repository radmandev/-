const required = (name, value) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const config = {
  port: Number(process.env.PORT || 3000),
  sendpulseWebhookSecret: process.env.SENDPULSE_WEBHOOK_SECRET || '',
  bitrix24: {
    registerUrl: process.env.BITRIX24_REGISTER_URL || '',
    sendMessagesUrl: process.env.BITRIX24_SEND_MESSAGES_URL || '',
    leadAddUrl: process.env.BITRIX24_LEAD_ADD_URL || '',
    openChannelId: Number(process.env.BITRIX24_OPEN_CHANNEL_ID || 7)
  }
};

export const assertBitrixConfig = () => {
  required('BITRIX24_REGISTER_URL', config.bitrix24.registerUrl);
  required('BITRIX24_SEND_MESSAGES_URL', config.bitrix24.sendMessagesUrl);
  required('BITRIX24_LEAD_ADD_URL', config.bitrix24.leadAddUrl);
  if (!Number.isFinite(config.bitrix24.openChannelId)) {
    throw new Error('BITRIX24_OPEN_CHANNEL_ID must be a number');
  }
};
