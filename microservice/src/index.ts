import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { LRUCache } from 'lru-cache';
import { fetchPage } from './browser';
import { maskPII } from './utils';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large payloads

// Cache: Map snapshot_key -> Response Data
const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 30, // 30 minutes
});

// Upload storage (memory)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Allowed Domains
const ALLOWED_DOMAINS = (process.env.ALLOWED_DOMAINS || '').split(',').map(d => d.trim()).filter(Boolean);

function isAllowed(url: string): boolean {
    if (ALLOWED_DOMAINS.length === 0) return true; // Default allow all if not set (dev mode)
    try {
        const hostname = new URL(url).hostname;
        return ALLOWED_DOMAINS.some(d => hostname.endsWith(d));
    } catch {
        return false;
    }
}

// Routes

// 1. Ping / Warmup
app.options('/ping', cors());
app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

// 2. Fetch URL
app.get('/fetch', async (req: Request, res: Response): Promise<void> => {
    const url = req.query.url as string;
    const force = req.query.force === 'true';

    if (!url) {
        res.status(400).json({ error: 'Missing url parameter' });
        return;
    }

    if (!isAllowed(url)) {
         res.status(403).json({ error: 'Domain not allowed' });
         return;
    }

    // Check Cache
    const cacheKey = `url:${url}`;
    if (!force && cache.has(cacheKey)) {
        console.log(`Cache hit for ${url}`);
        res.json(cache.get(cacheKey));
        return;
    }

    try {
        console.log(`Fetching ${url}...`);
        const result = await fetchPage(url);
        
        // PII Masking
        const maskedHtml = maskPII(result.html);

        const responseData = {
            source_type: 'fetched_screenshot',
            snapshot_key: cacheKey, // Using URL as key for now
            screenshot_base64: `data:image/jpeg;base64,${result.screenshot}`,
            rendered_html: maskedHtml,
            title: result.title,
            timestamp: new Date().toISOString(),
            pii_scan: {
               // Pseudo-stats for now
               masked: result.html !== maskedHtml 
            }
        };

        cache.set(cacheKey, responseData);
        res.json(responseData);
    } catch (error: any) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Upload Screenshot
app.post('/upload_screenshot', upload.single('screenshot'), (req: Request, res: Response): Promise<void> => {
    const file = (req as any).file;
    if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return Promise.resolve();
    }

    const base64 = file.buffer.toString('base64');
    const mimeType = file.mimetype;
    
    // Simple validation
    if (!mimeType.startsWith('image/')) {
        res.status(400).json({ error: 'Invalid file type' });
        return Promise.resolve();
    }

    const snapshotKey = `upload:${Date.now()}`;
    const responseData = {
        source_type: 'user_screenshot',
        snapshot_key: snapshotKey,
        screenshot_base64: `data:${mimeType};base64,${base64}`,
        rendered_html: null, // No HTML for pure screenshot uploads
        timestamp: new Date().toISOString(),
        pii_scan: { masked: false }
    };
    
    cache.set(snapshotKey, responseData);
    res.json(responseData);
    return Promise.resolve();
});

// 4. Upload HTML
app.post('/upload_html', upload.single('html'), async (req: Request, res: Response): Promise<void> => {
   // TODO: Implement HTML sanitization and optional rendering
   // For now, simple echo with masking
   const file = (req as any).file;
   if (!file) {
       res.status(400).json({ error: 'No file uploaded' });
       return;
   }
   
   const htmlContent = file.buffer.toString('utf-8');
   const maskedHtml = maskPII(htmlContent);
   const snapshotKey = `upload_html:${Date.now()}`;
   
   const responseData = {
       source_type: 'uploaded_html',
       snapshot_key: snapshotKey,
       screenshot_base64: null, // TODO: Render if needed
       rendered_html: maskedHtml,
       timestamp: new Date().toISOString(),
       pii_scan: { masked: htmlContent !== maskedHtml }
   };

   cache.set(snapshotKey, responseData);
   res.json(responseData);
});

app.listen(PORT, () => {
    console.log(`Microservice listening on port ${PORT}`);
});
