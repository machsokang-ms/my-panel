import express, { Request, Response } from 'express';
import Docker from 'dockerode';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateToken, comparePassword, hashPassword } from './auth';
import { APP_TEMPLATES } from './templates';

import { query, initDB } from './db';

dotenv.config();

const app = express();
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

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

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth: Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = MOCK_USERS.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // For mock: assume password is "admin"
  if (password !== 'admin') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, username: user.username } });
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

// Install an app
app.post('/api/apps/install', async (req: Request, res: Response) => {
  const { templateId, name, env, domain } = req.body;
  const template = APP_TEMPLATES.find(t => t.id === templateId);

  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }

  try {
    const containerConfig: any = {
      Image: template.image,
      name: name || `${template.id}-${Date.now()}`,
      Env: Object.entries({ ...template.defaultEnv, ...env }).map(([k, v]) => `${k}=${v}`),
      Labels: {
        'traefik.enable': 'true',
        [`traefik.http.routers.${name}.rule`]: `Host(\`${domain}\`)`,
        [`traefik.http.routers.${name}.entrypoints`]: 'websecure',
        [`traefik.http.routers.${name}.tls`]: 'true',
        [`traefik.http.routers.${name}.tls.certresolver`]: 'myresolver',
      },
      HostConfig: {
        NetworkMode: 'my-panel-network',
        RestartPolicy: { Name: 'always' }
      }
    };

    if (template.command) {
      containerConfig.Cmd = template.command;
    }

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
    const dbs = containers.filter(c => 
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
