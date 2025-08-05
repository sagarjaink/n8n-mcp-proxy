const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Your n8n-mcp server details
const N8N_MCP_URL = 'https://n8n-mcp-454l.onrender.com';
const N8N_MCP_TOKEN = 'BoZ6XXBZgy1fuGcmcUesdrPDPHjFdhmunNOEGGE8eAm-rnPTsWyM2Noka93DKJKj';

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', proxy: 'n8n-mcp' });
});

// MCP endpoint - proxy without requiring auth from Claude
app.all('/mcp', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${N8N_MCP_URL}/mcp`,
      headers: {
        'Authorization': `Bearer ${N8N_MCP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: req.body
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Proxy failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`N8N MCP Proxy running on port ${PORT}`);
});
