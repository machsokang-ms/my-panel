import express from 'express';
import Docker from 'dockerode';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const docker = new Docker({ socketPath: '/var/run/docker.sock' }); // Standard Docker socket on Linux/Docker Desktop
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import { APP_TEMPLATES } from './templates';

// ... (previous imports and setup)

// Install an app
app.post('/api/apps/install', async (req, res) => {
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
app.get('/api/databases', async (req, res) => {
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
