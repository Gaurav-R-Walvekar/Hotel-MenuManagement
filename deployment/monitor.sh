#!/bin/bash

# Monitoring Script for Hotel Menu Management
# This script monitors the health of your deployed application

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

echo "=========================================="
echo "Hotel Menu Management - System Monitor"
echo "=========================================="
echo ""

# Check PM2 status
print_status "Checking PM2 application status..."
if pm2 list | grep -q "hotel-menu-api"; then
    PM2_STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="hotel-menu-api") | .pm2_env.status')
    if [ "$PM2_STATUS" = "online" ]; then
        print_success "PM2 application is running"
    else
        print_error "PM2 application is not running (Status: $PM2_STATUS)"
    fi
else
    print_error "PM2 application not found"
fi

# Check Nginx status
print_status "Checking Nginx status..."
if systemctl is-active --quiet nginx; then
    print_success "Nginx is running"
else
    print_error "Nginx is not running"
fi

# Check if application is responding
print_status "Checking application health..."
if curl -s http://localhost:5000/health > /dev/null; then
    print_success "Application is responding on port 5000"
else
    print_error "Application is not responding on port 5000"
fi

# Check if Nginx proxy is working
print_status "Checking Nginx proxy..."
if curl -s http://localhost/health > /dev/null; then
    print_success "Nginx proxy is working"
else
    print_error "Nginx proxy is not working"
fi

# Check disk usage
print_status "Checking disk usage..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    print_success "Disk usage: ${DISK_USAGE}%"
else
    print_warning "Disk usage: ${DISK_USAGE}% (Consider cleanup)"
fi

# Check memory usage
print_status "Checking memory usage..."
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
print_status "Memory usage: ${MEMORY_USAGE}%"

# Check CPU usage
print_status "Checking CPU usage..."
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
print_status "CPU usage: ${CPU_USAGE}%"

# Check recent logs for errors
print_status "Checking recent application logs for errors..."
ERROR_COUNT=$(pm2 logs hotel-menu-api --lines 100 2>/dev/null | grep -i "error\|exception\|failed" | wc -l)
if [ "$ERROR_COUNT" -eq 0 ]; then
    print_success "No recent errors found in application logs"
else
    print_warning "Found $ERROR_COUNT recent errors in application logs"
fi

# Check Nginx error logs
print_status "Checking Nginx error logs..."
NGINX_ERRORS=$(sudo tail -n 50 /var/log/nginx/error.log 2>/dev/null | grep -v "favicon.ico" | wc -l)
if [ "$NGINX_ERRORS" -eq 0 ]; then
    print_success "No recent Nginx errors"
else
    print_warning "Found $NGINX_ERRORS recent Nginx errors"
fi

# Check MongoDB connection (if possible)
print_status "Checking MongoDB connection..."
if curl -s http://localhost:5000/api/menu > /dev/null; then
    print_success "MongoDB connection is working"
else
    print_error "MongoDB connection may have issues"
fi

# Check SSL certificate (if configured)
if [ -f "/etc/letsencrypt/live/$(hostname)/fullchain.pem" ]; then
    print_status "Checking SSL certificate..."
    CERT_EXPIRY=$(sudo certbot certificates | grep "VALID" | awk '{print $2}')
    print_status "SSL certificate expires: $CERT_EXPIRY"
fi

# Show recent PM2 logs
echo ""
print_status "Recent application logs (last 10 lines):"
pm2 logs hotel-menu-api --lines 10 --nostream

# Show system uptime
echo ""
print_status "System uptime:"
uptime

# Show active connections
echo ""
print_status "Active connections to port 80:"
netstat -an | grep :80 | grep ESTABLISHED | wc -l

echo ""
echo "=========================================="
print_status "Monitoring complete!"
echo "==========================================" 