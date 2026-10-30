import express from 'express';
import axios from 'axios';

const router = express.Router();

// Ensure res.status, res.json, res.send, and req.query are available in both Connect/Vite and Express environments
router.use((req, res, next) => {
  if (!req.query) {
    req.query = {};
    if (req.url && req.url.includes('?')) {
      try {
        const parsed = new URL(req.url, 'http://localhost');
        parsed.searchParams.forEach((val, key) => {
          req.query[key] = val;
        });
      } catch {}
    }
  }

  if (!res.status) {
    res.status = function(code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function(data) {
      this.setHeader('Content-Type', 'application/json; charset=utf-8');
      this.end(JSON.stringify(data));
      return this;
    };
  }
  if (!res.send) {
    res.send = function(data) {
      if (typeof data === 'object' && !Buffer.isBuffer(data)) {
        return this.json(data);
      }
      this.end(data);
      return this;
    };
  }
  next();
});

/**
 * Utility: rewrite an HLS .m3u8 playlist content so all segments,
 * sub-playlists, audio tracks, and AES-128 encryption keys route through the proxy.
 */
export function rewriteM3u8Playlist(playlistText, targetUrl, proxyEndpoint = '/api/proxy-stream') {
  const baseUrl = new URL(targetUrl);
  const lines = playlistText.split('\n');

  const resolveUrl = (uri) => {
    try {
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        return uri;
      }
      return new URL(uri, baseUrl.href).href;
    } catch {
      return uri;
    }
  };

  const wrapProxied = (uri) => {
    const absolute = resolveUrl(uri);
    return `${proxyEndpoint}?url=${encodeURIComponent(absolute)}`;
  };

  const rewritten = lines.map((line) => {
    const trimmed = line.trim();

    if (!trimmed) return line;

    // 1. Rewrite encryption keys: #EXT-X-KEY:METHOD=AES-128,URI="https://..."
    if (trimmed.startsWith('#EXT-X-KEY:')) {
      return line.replace(/URI="([^"]+)"/, (match, keyUri) => {
        return `URI="${wrapProxied(keyUri)}"`;
      });
    }

    // 2. Rewrite alternative audio/subtitles: #EXT-X-MEDIA:TYPE=AUDIO,...,URI="..."
    if (trimmed.startsWith('#EXT-X-MEDIA:') && trimmed.includes('URI=')) {
      return line.replace(/URI="([^"]+)"/, (match, mediaUri) => {
        return `URI="${wrapProxied(mediaUri)}"`;
      });
    }

    // 3. Skip other M3U tags
    if (trimmed.startsWith('#')) {
      return line;
    }

    // 4. This is a segment (.ts, .m4s, .aac) or sub-playlist (.m3u8) URL
    return wrapProxied(trimmed);
  });

  return rewritten.join('\n');
}

/**
 * Handle CORS Preflight (OPTIONS)
 */
const handleCorsOptions = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization, Accept, X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(204).end();
};

/**
 * Health Check & Diagnostic endpoint
 */
router.all('/api/proxy-health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    status: 'online',
    engine: 'UBlue TV Universal CORS Proxy & Stream Relayer v3.2',
    features: [
      'Automatic HLS .m3u8 playlist rewriting',
      'AES-128 encryption key relaying',
      'Binary .ts / .m4s / .aac stream piping',
      'User-Agent & Referer anti-block masking',
      'HTTP Range seeking and partial content relay'
    ],
    timestamp: new Date().toISOString()
  });
});

/**
 * Dedicated /api/proxy-playlist endpoint
 */
router.options('/api/proxy-playlist', handleCorsOptions);
router.get('/api/proxy-playlist', async (req, res) => {
  let targetUrl = req.query && typeof req.query.url === 'string' ? req.query.url : null;
  if (!targetUrl && req.url) {
    try {
      const parsed = new URL(req.url, 'http://localhost');
      targetUrl = parsed.searchParams.get('url');
    } catch {}
  }

  if (!targetUrl) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ error: 'Parâmetro "url" é obrigatório para /api/proxy-playlist.' });
  }

  try {
    let origin = 'https://google.com';
    try {
      origin = new URL(targetUrl).origin;
    } catch {}

    const response = await axios({
      method: 'get',
      url: targetUrl,
      responseType: 'text',
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (SmartTV; UBlueTV Proxy Engine/3.2; Linux) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': origin,
        'Accept': '*/*'
      }
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization, Accept');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');

    const rewrittenContent = rewriteM3u8Playlist(response.data, targetUrl, '/api/proxy-stream');
    return res.send(rewrittenContent);
  } catch (error) {
    console.warn(`[CORS Proxy Playlist Notice] Canal temporariamente indisponível: ${targetUrl} (${error.code || error.message})`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization, Accept');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

    const isClientHls = (req.headers && req.headers.accept && req.headers.accept.includes('mpegurl')) || (typeof targetUrl === 'string' && targetUrl.toLowerCase().includes('.m3u8'));
    const noFallback = Boolean(req.query?.nofallback) || (Boolean(req.url) && req.url.includes('nofallback=true'));
    if (isClientHls && !noFallback) {
      const fallbackUrl = 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8';
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');
      const failoverManifest = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
/api/proxy-stream?url=${encodeURIComponent(fallbackUrl)}
`;
      return res.send(failoverManifest);
    }

    return res.status(502).json({
      error: 'Falha ao processar playlist HLS via proxy CORS.',
      details: error.message,
      target: targetUrl
    });
  }
});

/**
 * Endpoint Proxy Universal: /api/proxy-stream
 * Handles both HLS playlists (with dynamic rewriting) AND binary chunks (.ts/.m4s/mp4/aac)
 */
router.options('/api/proxy-stream', handleCorsOptions);
router.get('/api/proxy-stream', async (req, res) => {
  let targetUrl = req.query && typeof req.query.url === 'string' ? req.query.url : null;
  if (!targetUrl && req.url) {
    try {
      const parsed = new URL(req.url, 'http://localhost');
      targetUrl = parsed.searchParams.get('url');
    } catch {}
  }

  if (!targetUrl) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ error: 'Parâmetro "url" é obrigatório para o proxy.' });
  }

  let origin = 'https://google.com';
  try {
    origin = new URL(targetUrl).origin;
  } catch {}

  const isM3u8ByUrl = targetUrl.toLowerCase().includes('.m3u8') || targetUrl.toLowerCase().includes('manifest');

  // Forward client Range header if requested (essential for seeking and video buffering)
  const forwardHeaders = {
    'User-Agent': 'Mozilla/5.0 (SmartTV; UBlueTV Proxy Engine/3.2; Linux) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': origin,
    'Accept': '*/*'
  };

  if (req.headers.range) {
    forwardHeaders['Range'] = req.headers.range;
  }

  try {
    // If it's explicitly an M3U8 playlist by URL, fetch as text to rewrite internal segments
    if (isM3u8ByUrl) {
      const response = await axios({
        method: 'get',
        url: targetUrl,
        responseType: 'text',
        timeout: 12000,
        headers: forwardHeaders
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization, Accept');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');

      // If the response text contains #EXTM3U, rewrite it
      if (typeof response.data === 'string' && response.data.includes('#EXTM3U')) {
        const rewritten = rewriteM3u8Playlist(response.data, targetUrl, '/api/proxy-stream');
        return res.send(rewritten);
      }
      return res.send(response.data);
    }

    // Otherwise, fetch as stream for real-time piping of video/audio chunks
    const response = await axios({
      method: 'get',
      url: targetUrl,
      responseType: 'stream',
      timeout: 15000,
      headers: forwardHeaders
    });

    const contentType = response.headers['content-type'] || 'application/octet-stream';

    // If upstream returns m3u8 even without extension in URL
    if (contentType.toLowerCase().includes('mpegurl') || contentType.toLowerCase().includes('application/x-mpegurl')) {
      let rawData = '';
      response.data.on('data', (chunk) => {
        rawData += chunk.toString();
      });
      response.data.on('end', () => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization, Accept');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');
        const rewritten = rewriteM3u8Playlist(rawData, targetUrl, '/api/proxy-stream');
        res.send(rewritten);
      });
      return;
    }

    // Set permissive CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization, Accept, X-Requested-With');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', contentType);

    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }
    if (response.headers['content-range']) {
      res.setHeader('Content-Range', response.headers['content-range']);
      res.status(206);
    } else {
      res.status(response.status || 200);
    }

    // Pipe stream directly to client without memory buffering
    response.data.pipe(res);

    response.data.on('error', (err) => {
      console.warn(`[CORS Proxy Stream Pipe Notice] ${targetUrl}:`, err.message);
      if (!res.headersSent) {
        res.status(502).end();
      }
    });

  } catch (error) {
    console.warn(`[CORS Proxy Stream Notice] Emissora offline temporariamente: ${targetUrl} (${error.code || error.message})`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(502).json({
      error: 'Falha ao sintonizar emissora via proxy CORS.',
      details: error.message,
      target: targetUrl
    });
  }
});

export default router;
