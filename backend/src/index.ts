import express, { Request, Response } from 'express';
import Docker from 'dockerode';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateToken, comparePassword, hashPassword } from './auth';
import { APP_TEMPLATES } from './templates';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { query, initDB } from './db';

dotenv.config();

const app = express();
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from uploads
app.use('/api/uploads', express.static(uploadDir));

// Multer setup for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Initialize DB
initDB();

// List all repositories
app.get('/api/repositories', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM repositories ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add a repository
app.post('/api/repositories', async (req: Request, res: Response) => {
  const { name, url, provider, branch, accessToken, project } = req.body;
  try {
    const result = await query(
      'INSERT INTO repositories (name, url, provider, branch, access_token, project) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, url, provider || 'github', branch || 'main', accessToken, project]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a repository
app.delete('/api/repositories/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM repositories WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- SERVERS ENDPOINTS ---
app.get('/api/servers', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM servers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/servers', async (req: Request, res: Response) => {
  const { name, ip_address, cpu_cores, ram_gb } = req.body;
  try {
    const result = await query(
      'INSERT INTO servers (name, ip_address, cpu_cores, ram_gb) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, ip_address, cpu_cores, ram_gb]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/servers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM servers WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- STORAGE ENDPOINTS ---
app.get('/api/storage', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM storage ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/storage', async (req: Request, res: Response) => {
  const { name, type, endpoint, region, accessKey, secretKey, bucket } = req.body;
  try {
    const result = await query(
      'INSERT INTO storage (name, type, endpoint, region, access_key, secret_key, bucket) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, type || 's3', endpoint, region, accessKey, secretKey, bucket]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/storage/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM storage WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- SETTINGS ENDPOINTS ---
app.get('/api/settings', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM settings LIMIT 1');
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', upload.single('logo'), async (req: Request, res: Response) => {
  const { platformName, primaryColor, autoSSL } = req.body;
  const logoUrl = req.file ? `/api/uploads/${req.file.filename}` : undefined;

  try {
    const currentResult = await query('SELECT * FROM settings LIMIT 1');
    const current = currentResult.rows[0];

    const result = await query(
      `UPDATE settings SET 
        platform_name = COALESCE($1, platform_name),
        primary_color = COALESCE($2, primary_color),
        logo_url = COALESCE($3, logo_url),
        auto_ssl = COALESCE($4, auto_ssl),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 RETURNING *`,
      [platformName, primaryColor, logoUrl, autoSSL === 'true' || autoSSL === true, current.id]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth: Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- APP MARKETPLACE ENDPOINTS ---

// List all templates
app.get('/api/templates', (req: Request, res: Response) => {
  res.json(APP_TEMPLATES);
});

// List all containers (Apps)
app.get('/api/apps', async (req: Request, res: Response) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.json(containers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- STORAGE ENDPOINTS ---

// List all storage connectors
app.get('/api/storage', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM storage ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add a storage connector
app.post('/api/storage', async (req: Request, res: Response) => {
  const { name, type, endpoint, region, accessKey, secretKey, bucket } = req.body;
  try {
    const result = await query(
      `INSERT INTO storage (name, type, endpoint, region, access_key, secret_key, bucket)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, type, endpoint, region, accessKey, secretKey, bucket]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a storage connector
app.delete('/api/storage/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM storage WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- MONITORING ENDPOINTS ---
app.get('/api/monitoring/overview', async (req: Request, res: Response) => {
  try {
    const servers = await query('SELECT * FROM servers');
    const storage = await query('SELECT count(*) FROM storage');
    const repos = await query('SELECT count(*) FROM repositories');
    const containers = await docker.listContainers({ all: true });
    
    const totalCpu = servers.rows.reduce((acc: number, s: any) => acc + (s.cpu_cores || 0), 0);
    const totalRam = servers.rows.reduce((acc: number, s: any) => acc + (s.ram_gb || 0), 0);
    
    const activeApps = containers.filter(c => c.State === 'running').length;
    const totalApps = containers.length;
    
    const dbs = containers.filter((c: any) => 
      c.Image.includes('postgres') || 
      c.Image.includes('mysql') || 
      c.Image.includes('mariadb') || 
      c.Image.includes('redis') || 
      c.Image.includes('mongodb')
    ).length;

    res.json({
      servers: {
        count: servers.rows.length,
        totalCpu,
        totalRam
      },
      apps: {
        total: totalApps,
        active: activeApps
      },
      databases: dbs,
      storage: parseInt(storage.rows[0].count),
      repositories: parseInt(repos.rows[0].count),
      systemStatus: 'healthy',
      overallCpuUsage: Math.random() * 5 + 1 // Mock local usage for now
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Install an app
app.post('/api/apps/install', async (req: Request, res: Response) => {
  const { templateId, name, env, domain } = req.body;
  const template = APP_TEMPLATES.find(t => t.id === templateId);

  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }

  const containerName = name || `${template.id}-${Date.now()}`;
  const finalEnv = { ...template.defaultEnv, ...env };

  try {
    const containerConfig: any = {
      Image: template.image,
      name: containerName,
      Env: Object.entries(finalEnv).map(([k, v]) => `${k}=${v}`),
      Labels: {
        'traefik.enable': 'true',
        [`traefik.http.routers.${containerName}.rule`]: `Host(\`${domain}\`)`,
        [`traefik.http.routers.${containerName}.entrypoints`]: 'websecure',
        [`traefik.http.routers.${containerName}.tls`]: 'true',
        [`traefik.http.routers.${containerName}.tls.certresolver`]: 'myresolver',
        [`traefik.http.services.${containerName}.loadbalancer.server.port`]: String(template.ports?.[0]?.container || 80),
      },
      HostConfig: {
        NetworkMode: 'my-panel-network',
        RestartPolicy: { Name: 'always' }
      }
    };

    if (template.command) {
      containerConfig.Cmd = template.command;
    }

    // Pull image if not exists
    await docker.pull(template.image, {});

    const container = await docker.createContainer(containerConfig);
    await container.start();

    res.json({ 
      success: true, 
      message: `${template.name} installed successfully`, 
      containerId: container.id,
      domain: domain
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List Databases
app.get('/api/databases', async (req: Request, res: Response) => {
  try {
    const containers = await docker.listContainers({ all: true });
    const dbs = containers.filter((c: any) => 
      c.Image.includes('postgres') || 
      c.Image.includes('mysql') || 
      c.Image.includes('mariadb') || 
      c.Image.includes('redis') || 
      c.Image.includes('mongodb')
    );
    res.json(dbs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 My-Panel API running on http://localhost:${port}`);
});
