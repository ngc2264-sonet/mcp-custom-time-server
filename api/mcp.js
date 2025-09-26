export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { method, params } = req.body;
  
  if (method === 'tools/list') {
    return res.json({
      tools: [{
        name: 'user_time_v0',
        description: 'Get current KST time',
        inputSchema: { type: 'object', properties: {} }
      }]
    });
  }
  
  if (method === 'tools/call' && params?.name === 'user_time_v0') {
    const now = new Date();
    const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return res.json({
      content: [{
        type: 'text',
        text: JSON.stringify({
          current_time: kstTime.toISOString().replace('Z', '+09:00'),
          day_short: now.toLocaleDateString('en-US', {timeZone: 'Asia/Seoul', weekday: 'short'})
        })
      }]
    });
  }
  
  return res.status(404).json({ error: 'Method not found' });
}
