# Deployment Guide: Node.js Backend to Hetzner Ubuntu Server

This guide will walk you through deploying your Hotel Menu Management backend to a new Hetzner Ubuntu server.

## Prerequisites

- A Hetzner Cloud account
- SSH access to your server
- MongoDB Atlas account (or local MongoDB)
- Domain name (optional, for production)

## Step 1: Create Hetzner Server

1. **Create a new Cloud Server in Hetzner:**
   - Choose Ubuntu 22.04 LTS
   - Select appropriate server size (CX11 or higher recommended)
   - Choose a datacenter location close to your users
   - Add your SSH key or create a password
   - Note down your server's IP address

## Step 2: Initial Server Setup

### Connect to your server:
```bash
ssh root@YOUR_SERVER_IP
```

### Update system packages:
```bash
apt update && apt upgrade -y
```

### Install essential packages:
```bash
apt install -y curl wget git ufw fail2ban
```

### Create a non-root user (recommended):
```bash
adduser deploy
usermod -aG sudo deploy
```

## Step 3: Install Node.js and PM2

### Install Node.js 18.x (LTS):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
```

### Verify installation:
```bash
node --version
npm --version
```

### Install PM2 globally:
```bash
npm install -g pm2
```

### Install PM2 startup script:
```bash
pm2 startup
```

## Step 4: Install and Configure Nginx

### Install Nginx:
```bash
apt install -y nginx
```

### Start and enable Nginx:
```bash
systemctl start nginx
systemctl enable nginx
```

### Configure firewall:
```bash
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw enable
```

## Step 5: Deploy Your Application

### Clone your repository:
```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/Hotel-MenuManagement.git
cd Hotel-MenuManagement
```

### Install dependencies:
```bash
npm install
```

### Create environment file:
```bash
cp env.template .env
nano .env
```

### Configure your .env file:
```env
# MongoDB Connection Configuration
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=hotelmanagement
PORT=5000
NODE_ENV=production
```

### Build the client (if you have a React frontend):
```bash
npm run build
```

## Step 6: Configure PM2

### Create PM2 ecosystem file:
```bash
nano ecosystem.config.js
```

### Add the following configuration:
```javascript
module.exports = {
  apps: [{
    name: 'hotel-menu-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_file: '.env',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Create logs directory:
```bash
mkdir logs
```

### Start the application with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
```

## Step 7: Configure Nginx as Reverse Proxy

### Create Nginx configuration:
```bash
nano /etc/nginx/sites-available/hotel-menu-api
```

### Add the following configuration:
```nginx
server {
    listen 80;
    server_name hotelserver.aisoft.it.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Increase upload size if needed
    client_max_body_size 10M;
}
```

### Enable the site:
```bash
ln -s /etc/nginx/sites-available/hotel-menu-api /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## Step 8: SSL Certificate (Optional but Recommended)

### Install Certbot:
```bash
apt install -y certbot python3-certbot-nginx
```

### Get SSL certificate:
```bash
certbot --nginx -d YOUR_DOMAIN
```

## Step 9: Monitoring and Maintenance

### Check application status:
```bash
pm2 status
pm2 logs
```

### Monitor system resources:
```bash
htop
df -h
```

### Set up automatic PM2 restart on server reboot:
```bash
pm2 startup
pm2 save
```

## Step 10: Database Setup

### If using MongoDB Atlas:
1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Update your .env file with the connection string
4. Ensure your server's IP is whitelisted in MongoDB Atlas

### If using local MongoDB:
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
```

## Troubleshooting

### Check application logs:
```bash
pm2 logs hotel-menu-api
tail -f logs/combined.log
```

### Check Nginx logs:
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Restart services:
```bash
pm2 restart hotel-menu-api
systemctl restart nginx
```

### Check if ports are open:
```bash
netstat -tlnp
```

## Security Considerations

1. **Keep system updated:**
   ```bash
   apt update && apt upgrade -y
   ```

2. **Configure fail2ban:**
   ```bash
   systemctl enable fail2ban
   systemctl start fail2ban
   ```

3. **Regular backups:**
   - Set up automated backups for your database
   - Backup your application code and configuration

4. **Monitor logs:**
   - Set up log monitoring
   - Configure alerts for critical errors

## Performance Optimization

1. **Enable Nginx caching:**
   - Configure static file caching
   - Enable gzip compression

2. **Database optimization:**
   - Add proper indexes
   - Monitor query performance

3. **PM2 clustering:**
   - Already configured in ecosystem.config.js
   - Adjust instances based on server resources

## Deployment Script

You can also use the provided deployment script:
```bash
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

## Support

If you encounter issues:
1. Check the logs using the commands above
2. Verify your environment variables
3. Ensure MongoDB connection is working
4. Check firewall and security group settings 