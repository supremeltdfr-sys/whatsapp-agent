require('dotenv').config();
const fetch = require('node-fetch');
async function sendMessage(to,text){
  const r=await fetch('https://graph.facebook.com/v19.0/'+process.env.PHONE_NUMBER_ID+'/messages',{
    method:'POST',
    headers:{'Authorization':'Bearer '+process.env.WHATSAPP_TOKEN,'Content-Type':'application/json'},
    body:JSON.stringify({messaging_product:'whatsapp',to,type:'text',text:{body:text}})
  });
  const d=await r.json();
  if(!r.ok)throw new Error(JSON.stringify(d));
  return d;
}
module.exports={sendMessage};
