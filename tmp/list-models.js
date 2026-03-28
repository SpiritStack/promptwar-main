const fs = require('fs');
const http = require('https');

const env = fs.readFileSync('.env.local', 'utf8');
const keyMatch = env.match(/GEMINI_API_KEY=(.+)/);
const key = keyMatch ? keyMatch[1].trim() : '';

http.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.error) {
        console.error("API Error:", parsed.error);
      } else {
        const models = parsed.models || [];
        console.log("Available Gemini models:");
        models.forEach(m => {
          if (m.name.includes("gemini")) console.log(m.name);
        });
      }
    } catch(e) { console.error(e, data); }
  });
}).on('error', err => console.error(err));
