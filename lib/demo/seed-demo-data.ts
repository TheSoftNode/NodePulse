import connectDB from '@/lib/db/connection';
import Node from '@/lib/db/models/Node';
import HealthCheck from '@/lib/db/models/HealthCheck';
import Alert from '@/lib/db/models/Alert';

/**
 * Seed demo data for impressive hackathon presentation
 */
export async function seedDemoData() {
  await connectDB();

  // Clear existing demo data
  await Node.deleteMany({ name: { $regex: /^Demo/ } });

  // Create diverse demo nodes
  const demoNodes = [
    {
      name: 'Demo Helium Hotspot - San Francisco',
      network: 'helium',
      endpoint: 'https://api.helium.io/v1/hotspots/demo-sf',
      checkInterval: 300,
      status: 'healthy',
      config: { location: 'San Francisco, CA', earnings: '125 HNT/month' },
    },
    {
      name: 'Demo Helium Hotspot - New York',
      network: 'helium',
      endpoint: 'https://api.helium.io/v1/hotspots/demo-ny',
      checkInterval: 300,
      status: 'healthy',
      config: { location: 'New York, NY', earnings: '98 HNT/month' },
    },
    {
      name: 'Demo Render GPU Node - London',
      network: 'render',
      endpoint: 'https://api.render.com/v1/nodes/demo-london',
      checkInterval: 180,
      status: 'healthy',
      config: { gpu: 'NVIDIA RTX 4090', location: 'London, UK' },
    },
    {
      name: 'Demo Render GPU Node - Tokyo',
      network: 'render',
      endpoint: 'https://api.render.com/v1/nodes/demo-tokyo',
      checkInterval: 180,
      status: 'warning',
      config: { gpu: 'NVIDIA RTX 3090', location: 'Tokyo, Japan' },
    },
    {
      name: 'Demo Arweave Gateway - Berlin',
      network: 'arweave',
      endpoint: 'https://arweave.net/info',
      checkInterval: 600,
      status: 'healthy',
      config: { storage: '50TB', location: 'Berlin, Germany' },
    },
    {
      name: 'Demo Arweave Gateway - Sydney',
      network: 'arweave',
      endpoint: 'https://arweave.net/info',
      checkInterval: 600,
      status: 'healthy',
      config: { storage: '100TB', location: 'Sydney, Australia' },
    },
    {
      name: 'Demo Custom API - Mumbai',
      network: 'generic',
      endpoint: 'https://api.example.com/health',
      checkInterval: 120,
      status: 'critical',
      config: { type: 'Custom DePIN', location: 'Mumbai, India' },
    },
    {
      name: 'Demo Custom API - Dubai',
      network: 'generic',
      endpoint: 'https://api.example.com/status',
      checkInterval: 120,
      status: 'healthy',
      config: { type: 'Custom DePIN', location: 'Dubai, UAE' },
    },
  ];

  const createdNodes = await Node.insertMany(demoNodes);

  // Create health check history for each node
  for (const node of createdNodes) {
    const healthChecks = [];
    const now = Date.now();

    // Generate 24 hours of health check data (every 5 minutes = 288 checks)
    for (let i = 0; i < 50; i++) {
      const checkedAt = new Date(now - i * 5 * 60 * 1000); // Every 5 minutes
      const isSuccess = node.status === 'critical' ? Math.random() > 0.7 : Math.random() > 0.05;
      const responseTime = isSuccess
        ? Math.floor(Math.random() * 2000) + 100 // 100-2100ms
        : Math.floor(Math.random() * 10000) + 5000; // 5-15s for failures

      healthChecks.push({
        nodeId: node._id,
        status: isSuccess ? 'success' : 'failure',
        responseTime,
        metrics: {
          online: isSuccess,
          cpuUsage: Math.random() * 100,
          memoryUsage: Math.random() * 100,
          diskSpace: Math.random() * 100,
        },
        checkedAt,
      });
    }

    await HealthCheck.insertMany(healthChecks);
  }

  // Create some demo alerts
  const criticalNode = createdNodes.find(n => n.status === 'critical');
  const warningNode = createdNodes.find(n => n.status === 'warning');

  if (criticalNode) {
    await Alert.create({
      nodeId: criticalNode._id,
      type: 'node_down',
      severity: 'critical',
      message: `${criticalNode.name} is experiencing connectivity issues`,
      resolved: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    });
  }

  if (warningNode) {
    await Alert.create({
      nodeId: warningNode._id,
      type: 'high_resource',
      severity: 'warning',
      message: `${warningNode.name} CPU usage is above 80%`,
      resolved: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
    });
  }

  return {
    nodesCreated: createdNodes.length,
    healthChecksCreated: createdNodes.length * 50,
    alertsCreated: 2,
  };
}

/**
 * Clear all demo data
 */
export async function clearDemoData() {
  await connectDB();

  const demoNodes = await Node.find({ name: { $regex: /^Demo/ } });
  const demoNodeIds = demoNodes.map(n => n._id);

  await HealthCheck.deleteMany({ nodeId: { $in: demoNodeIds } });
  await Alert.deleteMany({ nodeId: { $in: demoNodeIds } });
  await Node.deleteMany({ name: { $regex: /^Demo/ } });

  return { success: true };
}
