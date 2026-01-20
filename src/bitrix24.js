import { config } from './config.js';

const callBitrix24 = async (url, payload) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Bitrix24 error ${response.status}: ${text}`);
  }

  return response.json();
};

export const registerConnector = async (payload) => {
  return callBitrix24(config.bitrix24.registerUrl, payload);
};

export const sendOpenChannelMessage = async (payload) => {
  return callBitrix24(config.bitrix24.sendMessagesUrl, payload);
};

export const createLead = async (payload) => {
  return callBitrix24(config.bitrix24.leadAddUrl, payload);
};
