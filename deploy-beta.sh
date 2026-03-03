#!/bin/bash
# Bisudhishop Beta Deployment Script for Hetzner Ubuntu/Debian VPS
# Purpose: Installs dependencies, clones repo, sets up databases, builds and runs Storefront & Admin using PM2.
# Usage: Run this script as the root user on your fresh VPS.

set -e # Exit immediately if a command exits with a non-zero status

VPS_IP="89.167.77.99"
DOMAIN="bishudhi.com"
REPO_URL="https://github.com/shak0x90/bisudhishop.git"
APP_DIR="/var/www/bisudhishop"
DB_NAME="medusa-organichub"
DB_USER="postgres"
DB_PASS="postgres"

echo "========================================================"
echo "🚀 Starting Bisudhishop Beta Deployment for $DOMAIN"
echo "========================================================"

echo ""
echo "📦 1. Updating System Packages & Installing Prerequisites"
apt-get update && apt-get upgrade -y
apt-get install -y curl git build-essential nginx acl

echo ""
echo "� 1.5 Setup Swap Space (Prevents OOM during build)"
if [ -f /swapfile ]; then
    echo "Swapfile already exists. Skipping."
else
    echo "Creating 4GB swapfile..."
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    # Make it permanent
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    # Tweak swappiness for better performance on SSD/NVMe
    sysctl vm.swappiness=10
    echo 'vm.swappiness=10' | tee -a /etc/sysctl.conf
fi

echo ""
echo "�🟢 2. Installing Node.js 20 & PM2"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g npm@latest pm2 yarn

echo ""
echo "🐘 3. Installing PostgreSQL & Redis"
apt-get install -y postgresql postgresql-contrib redis-server
systemctl enable postgresql
systemctl start postgresql
systemctl enable redis-server
systemctl start redis-server

echo ""
echo "🗄️ 4. Configuring PostgreSQL Database"
# We wrap these in '|| true' so the script doesn't fail if the user/db already exists during a re-run
sudo -u postgres psql -c "CREATE DATABASE \"$DB_NAME\";" || true
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO $DB_USER;" || true
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;" || true

echo ""
echo "📂 5. Cloning Repository"
mkdir -p /var/www
cd /var/www
if [ -d "$APP_DIR" ]; then
  echo "Directory exists. Pulling latest code..."
  cd $APP_DIR
  git reset --hard
  git pull origin main
else
  git clone $REPO_URL
  cd bisudhishop
fi

echo ""
echo "⚙️ 6. Configuring Environment Variables"
# Backend .env
cat <<EOF > $APP_DIR/.env
STORE_CORS=http://$DOMAIN,http://www.$DOMAIN,http://localhost:8000
ADMIN_CORS=http://admin.$DOMAIN,http://$DOMAIN:9000,http://localhost:5173
AUTH_CORS=http://admin.$DOMAIN,http://$DOMAIN:9000,http://localhost:5173
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecretbeta2026
COOKIE_SECRET=supersecretbeta2026
DATABASE_URL=postgres://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
DB_NAME=$DB_NAME
EOF

# Storefront .env.local
cat <<EOF > $APP_DIR/storefront/.env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://$DOMAIN:9000
NEXT_PUBLIC_DEFAULT_REGION=bd
EOF


echo ""
echo "🏗️ 7. Installing & Building Backend (Medusa & Admin)"
cd $APP_DIR
npm install
echo "Running Medusa Database Migrations..."
npx medusa db:migrate
echo "Seeding Medusa Database (Sales Channel & API Key)..."
npm run seed || true

echo "Fetching Publishable API Key from Database..."
PUB_KEY=$(sudo -u postgres psql -d $DB_NAME -t -c "SELECT token FROM api_key WHERE type='publishable' LIMIT 1;" | xargs)
echo "Found Publishable Key: $PUB_KEY"

# Append key to Storefront .env.local
echo "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$PUB_KEY" >> $APP_DIR/storefront/.env.local

echo "Building Medusa Admin..."
npm run build


echo ""
echo "🛒 8. Installing & Building Storefront (Next.js)"
cd $APP_DIR/storefront
npm install
echo "Building Next.js Storefront..."
npm run build


echo ""
echo "🚀 9. Starting Services with PM2"
cd $APP_DIR
pm2 start npm --name "medusa-backend" -- run start
cd $APP_DIR/storefront
pm2 start npm --name "medusa-storefront" -- run start
pm2 save
pm2 startup | tail -n 1 | bash


echo ""
echo "🌐 10. Configuring Nginx Reverse Proxy (Port 80 -> Storefront)"
# We will route port 80 to the Next.js storefront (port 8000)
cat <<EOF > /etc/nginx/sites-available/bisudhishop
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/bisudhishop /etc/nginx/sites-enabled/ || true
rm /etc/nginx/sites-enabled/default || true
nginx -t
systemctl restart nginx


echo "========================================================"
echo "✅ BETA DEPLOYMENT COMPLETE!"
echo "========================================================"
echo "🌍 Customer Storefront: http://$DOMAIN"
echo "🛠️ Medusa Admin Panel:  http://$DOMAIN:9000/app"
echo ""
echo "Note: If the Admin Panel prompts you to login, Medusa usually requires creating a user first."
echo "To create an admin user manually, run this command inside /var/www/bisudhishop:"
echo "npx medusa user -e admin@bisudhishop.com -p password123"
echo "========================================================"
