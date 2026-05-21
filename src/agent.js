require('dotenv').config();
const fetch = require('node-fetch');
const { addMessage, getHistory, clearHistory } = require('./memory');
const { sendMessage } = require('./whatsapp');

const SYSTEM = `Tu es Alex, assistant service client. Reponds en francais, sois concis (3-4 phrases max). Commandes: reset=reinitialise, agent humain=escalade.`;

async function callClaude(history) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, system: SYSTEM, messages: history })
  });
  return (await r.json()).content[0].text;
}

async function handleIncomingMessage(from, name, text) {
  try {
    const low = text.toLowerCase().trim();
    if (['reset','recommencer'].includes(low)) { clearHistory(from); return sendMessage(from, 'Conversation reinitialisee ! Comment puis-je vous aider ' + name + ' ?'); }
    if (low.includes('agent humain')) { console.log('ESCALADE: '+from); return sendMessage(from, 'Je transmets a notre equipe. Quelqun vous contactera bientot !'); }
    addMessage(from, 'user', text);
    const reply = await callClaude(getHistory(from));
    addMessage(from, 'assistant', reply);
    await sendMessage(from, reply);
  } catch(e) { console.error(e); await sendMessage(from, 'Erreur technique. Tapez agent humain pour aide.'); }
}

module.exports = { handleIncomingMessage };
