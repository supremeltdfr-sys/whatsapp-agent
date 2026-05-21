const m = new Map();
function addMessage(p,r,c){if(!m.has(p))m.set(p,[]);const h=m.get(p);h.push({role:r,content:c});if(h.length>20)h.splice(0,h.length-20);}
function getHistory(p){return m.get(p)||[];}
function clearHistory(p){m.delete(p);}
module.exports={addMessage,getHistory,clearHistory};
