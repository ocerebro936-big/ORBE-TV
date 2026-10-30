import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, Plugin} from 'vite';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';

import corsProxyRouter from './corsProxyServer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Built-in IPTV CORS proxy & Stream Relayer plugin
const iptvStreamProxyPlugin = (): Plugin => ({
  name: 'iptv-stream-proxy',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      (corsProxyRouter as any)(req, res, next);
    });
  }
});

// Built-in NetCombo / Claro TV Solr EPG Gatekeeper proxy
const netcomboProxyPlugin = (): Plugin => ({
  name: 'netcombo-proxy',
  configureServer(server) {
    server.middlewares.use('/api/netcombo-proxy', async (req, res) => {
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.statusCode = 204;
        res.end();
        return;
      }

      try {
        const reqUrl = req.url || '';
        const queryString = reqUrl.includes('?') ? reqUrl.substring(reqUrl.indexOf('?') + 1) : '';
        const target = `https://programacao.netcombo.com.br/gatekeeper/canal/select?${queryString}&wt=json`;

        const upstream = await fetch(target, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.net.com.br/tv-por-assinatura/programacao/grade',
            'Accept': 'application/json, text/javascript, */*; q=0.01'
          }
        });

        const text = await upstream.text();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(text);
      } catch (err: any) {
        res.statusCode = 502;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err?.message || 'NetCombo proxy error' }));
      }
    });
  }
});

// Built-in Rei dos Canais API Proxy
const reiDosCanaisProxyPlugin = (): Plugin => ({
  name: 'reidoscanais-proxy',
  configureServer(server) {
    server.middlewares.use('/api/reidoscanais-proxy', async (req, res) => {
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.statusCode = 204;
        res.end();
        return;
      }

      try {
        const reqUrl = req.url || '';
        const target = `https://api.reidoscanais.si${reqUrl}`;

        const upstream = await fetch(target, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*'
          }
        });

        const text = await upstream.text();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(text);
      } catch (err: any) {
        res.statusCode = 502;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err?.message || 'Rei dos Canais proxy error' }));
      }
    });
  }
});

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      iptvStreamProxyPlugin(),
      netcomboProxyPlugin(),
      reiDosCanaisProxyPlugin()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
