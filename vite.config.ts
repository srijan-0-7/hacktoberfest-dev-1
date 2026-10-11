import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { handleIdentifyRequest } from './api/identify';

// Load .env variables for local development
dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'dev-api-identify-middleware',
      configureServer(server) {
        server.middlewares.use('/api/identify', async (req, res) => {
          if (req.method === 'OPTIONS') {
            res.writeHead(200, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            });
            res.end();
            return;
          }

          if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
            return;
          }

          let bodyBuffer = '';
          req.on('data', chunk => {
            bodyBuffer += chunk;
          });

          req.on('end', async () => {
            try {
              const body = bodyBuffer ? JSON.parse(bodyBuffer) : {};
              const result = await handleIdentifyRequest(body);

              res.writeHead(result.status, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(JSON.stringify(result.body));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message || 'Server error' }));
            }
          });
        });
      },
    },
  ],
  server: {
    port: 3000,
    host: true,
  },
});
