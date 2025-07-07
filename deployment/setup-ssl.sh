#!/bin/bash

# SSL Certificate Setup Script for Hotel Menu Management
# This script sets up SSL certificates using Let's Encrypt

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if domain is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <your-domain.com>"
    print_error "Example: $0 api.myhotel.com"
    exit 1
fi

DOMAIN=$1

print_status "Setting up SSL certificate for domain: $DOMAIN"

# Install Certbot if not already installed
if ! command -v certbot &> /dev/null; then
    print_status "Installing Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
    print_success "Certbot installed"
else
    print_success "Certbot already installed"
fi

# Update Nginx configuration with domain
print_status "Updating Nginx configuration..."
sudo sed -i "s/YOUR_DOMAIN_OR_IP/$DOMAIN/g" /etc/nginx/sites-available/hotel-menu-api
sudo nginx -t
sudo systemctl reload nginx
print_success "Nginx configuration updated"

# Get SSL certificate
print_status "Obtaining SSL certificate from Let's Encrypt..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Test certificate renewal
print_status "Testing certificate renewal..."
sudo certbot renew --dry-run

# Set up automatic renewal
print_status "Setting up automatic certificate renewal..."
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

print_success "SSL certificate setup completed!"
print_success "Your application is now accessible at: https://$DOMAIN"
print_warning "Certificate will automatically renew every 60 days"

# Show certificate info
print_status "Certificate information:"
sudo certbot certificates 