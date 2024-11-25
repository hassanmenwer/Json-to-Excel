const json2xls = require('json2xls');
const fs = require('fs');

const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

let formattedData = [];

jsonData.forEach((item) => {
    if (Array.isArray(item.messages)) {
        for (let i = 0; i < item.messages.length; i += 2) {
            const userMsg = item.messages[i];
            const botMsg = item.messages[i + 1];

            if (userMsg && userMsg.role === 'user') {
                const userText = `${userMsg.role}: ${userMsg.content} (${userMsg.time})`;
                const botText = botMsg && botMsg.role === 'bot' 
                    ? `${botMsg.role}: ${botMsg.content} (${botMsg.time})` 
                    : '';
                
                formattedData.push({ 
                    id: item.id,
                    source: item.source,
                    sessionId: item.sessionId,
                    memoryType: item.memoryType,
                    email: item.email,
                    messages: userText + '\n' + botText 
                });
            }
        }
    }
});

const xls = json2xls(formattedData);
fs.writeFileSync('data.xlsx', xls, 'binary');

console.log('Done');
