export const APP_TEMPLATES = [
  {
    id: 'minio',
    name: 'MinIO (S3 Storage)',
    description: 'High performance, S3 compatible object storage.',
    image: 'minio/minio',
    icon: 'Cloud',
    defaultEnv: {
      MINIO_ROOT_USER: 'admin',
      MINIO_ROOT_PASSWORD: 'password123',
    },
    command: ['server', '/data', '--console-address', ':9001'],
    ports: [
      { container: 9000, label: 'api' },
      { container: 9001, label: 'console' }
    ]
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'The world\'s most popular website builder.',
    image: 'wordpress:latest',
    icon: 'Globe',
    defaultEnv: {
      WORDPRESS_DB_HOST: 'db:3306',
      WORDPRESS_DB_USER: 'wordpress',
      WORDPRESS_DB_PASSWORD: 'wordpress_password',
      WORDPRESS_DB_NAME: 'wordpress',
    },
    ports: [
      { container: 80, label: 'web' }
    ]
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'The world\'s most advanced open source database.',
    image: 'postgres:15-alpine',
    icon: 'Database',
    defaultEnv: {
      POSTGRES_USER: 'admin',
      POSTGRES_PASSWORD: 'admin_password',
      POSTGRES_DB: 'mypanel_db',
    },
    ports: [
      { container: 5432, label: 'db' }
    ]
  }
];
