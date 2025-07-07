# Quick Deployment Reference

This directory contains all the files needed to deploy your Hotel Menu Management backend to a Hetzner Ubuntu server.

## Files Overview

- `deploy.sh` - Main deployment script (automates the entire process)
- `setup-ssl.sh` - SSL certificate setup script
- `monitor.sh` - System monitoring script
- `nginx.conf` - Nginx configuration template
- `README.md` - This file

## Quick Start

### 1. Create Hetzner Server
- Ubuntu 22.04 LTS
- CX11 or higher recommended
- Add your SSH key

### 2. Connect and Deploy
```bash
# Connect to your server
ssh root@YOUR_SERVER_IP

# Create a non-root user (recommended)
adduser deploy
usermod -aG sudo deploy
su - deploy

# Clone your repository
cd /var/www
git clone https://github.com/YOUR_USERNAME/Hotel-MenuManagement.git
cd Hotel-MenuManagement

# Make scripts executable
chmod +x deployment/deploy.sh deployment/setup-ssl.sh deployment/monitor.sh

# Run the deployment script
./deployment/deploy.sh
```

### 3. Configure Environment
```bash
# Edit environment file
nano .env

# Add your MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
```

### 4. Restart Application
```bash
pm2 restart hotel-menu-api
```

## SSL Setup (Optional)

If you have a domain name:
```bash
./deployment/setup-ssl.sh your-domain.com
```

## Monitoring

Check system health:
```bash
./deployment/monitor.sh
```

## Useful Commands

### PM2 (Process Manager)
```bash
pm2 status                    # Check app status
pm2 logs hotel-menu-api       # View logs
pm2 restart hotel-menu-api    # Restart app
pm2 stop hotel-menu-api       # Stop app
pm2 delete hotel-menu-api     # Remove app
```

### Nginx
```bash
sudo systemctl status nginx   # Check status
sudo systemctl restart nginx  # Restart
sudo nginx -t                 # Test configuration
sudo tail -f /var/log/nginx/error.log  # View error logs
```

### System
```bash
htop                         # Monitor resources
df -h                        # Check disk usage
free -h                      # Check memory
netstat -tlnp                # Check open ports
```

## Troubleshooting

### Application Not Starting
1. Check logs: `pm2 logs hotel-menu-api`
2. Verify environment variables: `cat .env`
3. Test MongoDB connection: `npm run test-db`

### Nginx Issues
1. Check configuration: `sudo nginx -t`
2. View error logs: `sudo tail -f /var/log/nginx/error.log`
3. Check if port 80 is open: `sudo ufw status`

### SSL Issues
1. Check certificate: `sudo certbot certificates`
2. Test renewal: `sudo certbot renew --dry-run`
3. Check Nginx SSL config

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] Fail2ban enabled
- [ ] Non-root user created
- [ ] SSH key authentication
- [ ] SSL certificate installed (if domain)
- [ ] MongoDB IP whitelisted
- [ ] Environment variables secured

## Backup Strategy

### Database Backup
```bash
# MongoDB Atlas - Enable automated backups
# Or for local MongoDB:
mongodump --uri="your_connection_string" --out=/backup/$(date +%Y%m%d)
```

### Application Backup
```bash
# Backup application files
tar -czf /backup/app-$(date +%Y%m%d).tar.gz /var/www/Hotel-MenuManagement
```

## Performance Optimization

1. **PM2 Clustering**: Already configured in `ecosystem.config.js`
2. **Nginx Caching**: Configured in `nginx.conf`
3. **Gzip Compression**: Enabled in Nginx
4. **Rate Limiting**: Configured for API endpoints

## Support

If you encounter issues:
1. Check the logs using the monitoring script
2. Verify all environment variables are set
3. Ensure MongoDB connection is working
4. Check firewall and security group settings
5. Review the main `DEPLOYMENT.md` file for detailed instructions 