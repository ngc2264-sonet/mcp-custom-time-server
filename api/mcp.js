export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      jsonrpc: '2.0',
      error: { code: -32601, message: 'Method not allowed' },
      id: null
    });
  }

  const { jsonrpc, method, params, id } = req.body;

  // MCP initialize method
  if (method === 'initialize') {
    return res.json({
      jsonrpc: '2.0',
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'mcp-custom-time-server',
          version: '1.0.0'
        }
      },
      id
    });
  }

  if (method === 'tools/list') {
    return res.json({
      jsonrpc: '2.0',
      result: {
        tools: [{
          name: 'user_time_v0',
          description: 'Get current KST time',
          inputSchema: { type: 'object', properties: {} }
        }]
      },
      id
    });
  }

  if (method === 'tools/call' && params?.name === 'user_time_v0') {
    const now = new Date();
    const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return res.json({
      jsonrpc: '2.0',
      result: {
        content: [{
          type: 'text',
          text: JSON.stringify({
            current_time: kstTime.toISOString().replace('Z', '+09:00'),
            day_short: now.toLocaleDateString('en-US', {timeZone: 'Asia/Seoul', weekday: 'short'})
          })
        }]
      },
      id
    });
  }

  return res.status(404).json({
    jsonrpc: '2.0',
    error: { code: -32601, message: 'Method not found' },
    id
  });
}
