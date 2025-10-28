# NodePulse Quick Start Guide

Get NodePulse running in under 5 minutes!

## 🚀 Fastest Way: Docker Compose

```bash
# 1. Start everything
docker-compose up -d

# 2. Open browser
open http://localhost:3000

# 3. Add your first node!
```

That's it! NodePulse is now running with MongoDB.

---

## 📝 Step-by-Step First Use

### 1. Add Your First Node

1. Click **"+ Add Node"** button
2. Fill in the form:
   - **Name**: My Test Node
   - **Network**: Generic HTTP
   - **Endpoint**: https://api.github.com (for testing)
   - **Check Interval**: 300 seconds
3. Click **"Add Node"**

### 2. Trigger a Health Check

- Click the node card to view details
- Click **"Check Now"** to manually trigger a health check
- Watch the stats update!

### 3. Set Up Automated Checks

```bash
# Add to crontab (every 5 minutes)
*/5 * * * * curl -X POST http://localhost:3000/api/cron/health-check \
  -H "Authorization: Bearer your-secret-key"
```

---

## 🧪 Testing with Sample Endpoints

### Good Endpoint (Always Online)
- **URL**: `https://api.github.com`
- **Expected**: ✅ Healthy status

### Bad Endpoint (Simulates Failure)
- **URL**: `https://httpstat.us/500`
- **Expected**: 🔴 Critical status

### Slow Endpoint (Simulates Warning)
- **URL**: `https://httpstat.us/200?sleep=3000`
- **Expected**: 🟡 Warning status (slow response)

---

## 📊 What You Should See

### Dashboard
- **Stats Cards**: Total, Healthy, Warning, Critical nodes
- **Node Grid**: All your configured nodes
- **Alert Panel**: Recent alerts and notifications

### Node Detail Page
- Current status and uptime percentage
- Average response time
- Configuration details
- Recent health check history

---

## 🔧 Configuration

### Environment Variables (.env.local)
```env
MONGODB_URI=mongodb://localhost:27017/nodepulse
CRON_SECRET=your-secret-key-here
DISCORD_WEBHOOK_URL=  # Optional
TELEGRAM_BOT_TOKEN=   # Optional
```

### Alert Notifications

**Discord**:
1. Create webhook in Discord channel settings
2. Add URL to `.env.local`
3. Restart application

**Telegram**:
1. Create bot with @BotFather
2. Get chat ID
3. Add credentials to `.env.local`

---

## 🎯 Next Steps

1. **Add Real Nodes**: Replace test endpoints with your actual nodes
2. **Configure Alerts**: Set up notification channels
3. **Monitor**: Watch your infrastructure in real-time
4. **Scale**: Add more nodes and configure advanced rules

---

## 🐛 Troubleshooting

**MongoDB Connection Error?**
```bash
# Start MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Can't add nodes?**
- Check MongoDB is running
- Verify MONGODB_URI in .env.local
- Check browser console for errors

**Health checks not running?**
- Set up cron job (see above)
- Or manually click "Check Now" on each node

---

## 📚 Learn More

- [Full Documentation](README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [API Reference](README.md#api-documentation)

---

**Ready to monitor your DePIN infrastructure!** 🚀
