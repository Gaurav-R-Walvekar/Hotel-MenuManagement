#!/bin/bash

# Hotel Menu Management - Hetzner Deployment Script
# This script automates the deployment process on a Hetzner Ubuntu server

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

print_status "Starting Hotel Menu Management deployment..."

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System packages updated"

# Install essential packages
print_status "Installing essential packages..."
sudo apt install -y curl wget git ufw fail2ban nginx
print_success "Essential packages installed"

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
print_success "Node.js installed"

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js version: $NODE_VERSION"
print_success "npm version: $NPM_VERSION"

# Install PM2 globally
print_status "Installing PM2..."
sudo npm install -g pm2
print_success "PM2 installed"

# Setup PM2 startup script
print_status "Setting up PM2 startup script..."
pm2 startup
print_success "PM2 startup script configured"

# Create application directory
print_status "Setting up application directory..."
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www

# Clone repository (you'll need to update this URL)
if [ ! -d "Hotel-MenuManagement" ]; then
    print_status "Cloning repository..."
    git clone https://github.com/YOUR_USERNAME/Hotel-MenuManagement.git
    print_success "Repository cloned"
else
    print_status "Repository already exists, pulling latest changes..."
    cd Hotel-MenuManagement
    git pull origin main
    print_success "Repository updated"
fi

cd Hotel-MenuManagement

# Install dependencies
print_status "Installing Node.js dependencies..."
npm install
print_success "Dependencies installed"

# Create logs directory
mkdir -p logs

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating environment file..."
    cp env.template .env
    print_warning "Please edit .env file with your MongoDB connection string and other settings"
    print_warning "Run: nano .env"
else
    print_success "Environment file already exists"
fi

# Build client (if React frontend exists)
if [ -d "client" ]; then
    print_status "Building React client..."
    npm run build
    print_success "Client built successfully"
else
    print_warning "No client directory found, skipping build"
fi

# Start application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
print_success "Application started with PM2"

# Configure Nginx
print_status "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/hotel-menu-api > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    client_max_body_size 10M;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/hotel-menu-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
print_success "Nginx configured"

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable
print_success "Firewall configured"

# Enable and start fail2ban
print_status "Configuring fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
print_success "Fail2ban configured"

# Check application status
print_status "Checking application status..."
pm2 status

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)
print_success "Deployment completed!"
print_success "Your application should be accessible at: http://$SERVER_IP"
print_warning "Don't forget to:"
print_warning "1. Edit the .env file with your MongoDB connection string"
print_warning "2. Configure your domain name in Nginx if you have one"
print_warning "3. Set up SSL certificate with Certbot if needed"
print_warning "4. Whitelist your server IP in MongoDB Atlas"

# Show useful commands
echo ""
print_status "Useful commands:"
echo "  Check app status: pm2 status"
echo "  View logs: pm2 logs hotel-menu-api"
echo "  Restart app: pm2 restart hotel-menu-api"
echo "  Check Nginx status: sudo systemctl status nginx"
echo "  View Nginx logs: sudo tail -f /var/log/nginx/error.log" 