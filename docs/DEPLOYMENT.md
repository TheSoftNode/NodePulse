# NodePulse Deployment Guide

## Quick Start with Docker Compose

### 1. Prerequisites
- Docker and Docker Compose installed
- `.env.local` file configured (copy from `.env.example`)

### 2. Deploy with Docker Compose

```bash
# Start MongoDB and NodePulse
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

The application will be available at `http://localhost:3000`

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use local MongoDB installation
mongod
```

### 3. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB URI
```

### 4. Start Development Server
```bash
npm run dev
```

---

## Production Deployment

### Option 1: Docker (Recommended)

1. **Build the image**
```bash
docker build -t nodepulse:latest .
```

2. **Run with environment variables**
```bash
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI="mongodb://your-mongodb:27017/nodepulse" \
  -e CRON_SECRET="your-secret-key" \
  --name nodepulse \
  nodepulse:latest
```

### Option 2: NodeOps Marketplace

1. **Push to GitHub**
```bash
git push origin main
```

2. **Submit to NodeOps**
   - Go to NodeOps Marketplace
   - Submit your repository
   - Configure environment variables
   - Deploy!

---

## Setting Up Automated Health Checks

### Using Cron (Linux/Mac)

Add to crontab (`crontab -e`):
```bash
# Run health checks every 5 minutes
*/5 * * * * curl -X POST http://localhost:3000/api/cron/health-check \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Using GitHub Actions

Create `.github/workflows/health-check.yml`:
```yaml
name: Health Check Cron
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Health Check
        run: |
          curl -X POST https://your-nodepulse-url.com/api/cron/health-check \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Using External Cron Services
- **EasyCron**: https://www.easycron.com
- **Cron-job.org**: https://cron-job.org
- **Render Cron Jobs**: Configure in Render dashboard

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `CRON_SECRET` | Yes | Secret for cron authentication |
| `DISCORD_WEBHOOK_URL` | No | Discord webhook for alerts |
| `TELEGRAM_BOT_TOKEN` | No | Telegram bot token |
| `TELEGRAM_CHAT_ID` | No | Telegram chat ID |

---

## Monitoring the Application

### Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

### View Logs
```bash
# Docker Compose
docker-compose logs -f app

# Docker
docker logs -f nodepulse
```

---

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify network connectivity

### Health Checks Not Running
- Verify cron job is configured
- Check CRON_SECRET matches
- View application logs

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## Scaling

### Horizontal Scaling
- Run multiple NodePulse instances
- Use shared MongoDB database
- Configure load balancer

### Database Optimization
- Add indexes (already configured)
- Enable MongoDB replication
- Set up automated backups

---

## Security Checklist

- [ ] Change default CRON_SECRET
- [ ] Use strong MongoDB credentials
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS in production
- [ ] Restrict API access with firewall
- [ ] Regularly update dependencies

---

## Support

- **Documentation**: https://github.com/yourusername/nodepulse
- **Issues**: https://github.com/yourusername/nodepulse/issues
- **Discord**: [Join community](https://discord.gg/nodepulse)
