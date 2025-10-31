import { INode, NetworkType } from '@/lib/types/node';
import HealthCheck from '@/lib/db/models/HealthCheck';

interface NetworkBenchmark {
  network: NetworkType;
  averageUptime: number;
  averageResponseTime: number;
  totalNodes: number;
  lastUpdated: Date;
}

interface HealthScore {
  score: number; // 0-100
  percentile: number; // 0-100 (higher is better)
  rank: string; // "Excellent", "Good", "Average", "Poor"
  insights: string[];
  comparison: {
    yourUptime: number;
    networkAverage: number;
    yourResponseTime: number;
    networkAverageResponseTime: number;
  };
}

export class NetworkBenchmarkService {
  /**
   * Calculate health score for a node compared to network averages
   */
  async calculateHealthScore(node: INode): Promise<HealthScore> {
    // Get node's performance metrics
    const nodeMetrics = await this.getNodeMetrics(node._id);

    // Get network benchmarks (simulated for now, would be real API calls)
    const networkBenchmark = await this.getNetworkBenchmark(node.network);

    // Calculate score components
    const uptimeScore = this.calculateUptimeScore(nodeMetrics.uptime, networkBenchmark.averageUptime);
    const responseScore = this.calculateResponseScore(
      nodeMetrics.avgResponseTime,
      networkBenchmark.averageResponseTime
    );

    // Combined score (weighted average)
    const score = Math.round(uptimeScore * 0.7 + responseScore * 0.3);

    // Calculate percentile (where you rank among all nodes)
    const percentile = this.calculatePercentile(score);

    // Determine rank
    const rank = this.determineRank(percentile);

    // Generate insights
    const insights = this.generateInsights(
      nodeMetrics,
      networkBenchmark,
      percentile
    );

    return {
      score,
      percentile,
      rank,
      insights,
      comparison: {
        yourUptime: nodeMetrics.uptime,
        networkAverage: networkBenchmark.averageUptime,
        yourResponseTime: nodeMetrics.avgResponseTime,
        networkAverageResponseTime: networkBenchmark.averageResponseTime,
      },
    };
  }

  private async getNodeMetrics(nodeId: string) {
    const checks = await HealthCheck.find({ nodeId })
      .sort({ checkedAt: -1 })
      .limit(100)
      .lean();

    if (checks.length === 0) {
      return { uptime: 0, avgResponseTime: 0, totalChecks: 0 };
    }

    const successfulChecks = checks.filter(c => c.status === 'success').length;
    const uptime = (successfulChecks / checks.length) * 100;
    const avgResponseTime = checks.reduce((sum, c) => sum + c.responseTime, 0) / checks.length;

    return {
      uptime,
      avgResponseTime,
      totalChecks: checks.length,
    };
  }

  private async getNetworkBenchmark(network: NetworkType): Promise<NetworkBenchmark> {
    // Simulated network benchmarks (in production, fetch from DePIN network APIs)
    const benchmarks: Record<NetworkType, NetworkBenchmark> = {
      helium: {
        network: 'helium',
        averageUptime: 94.5,
        averageResponseTime: 850,
        totalNodes: 985000,
        lastUpdated: new Date(),
      },
      render: {
        network: 'render',
        averageUptime: 96.2,
        averageResponseTime: 450,
        totalNodes: 12500,
        lastUpdated: new Date(),
      },
      arweave: {
        network: 'arweave',
        averageUptime: 98.1,
        averageResponseTime: 320,
        totalNodes: 850,
        lastUpdated: new Date(),
      },
      generic: {
        network: 'generic',
        averageUptime: 92.0,
        averageResponseTime: 1200,
        totalNodes: 5000,
        lastUpdated: new Date(),
      },
    };

    return benchmarks[network];
  }

  private calculateUptimeScore(yourUptime: number, networkAverage: number): number {
    // Score from 0-100 based on how much better/worse than average
    const difference = yourUptime - networkAverage;

    // Perfect uptime (>99%) = 100
    if (yourUptime >= 99) return 100;

    // Better than network average by 5%+ = 95
    if (difference >= 5) return 95;

    // Better than network average = 85-94
    if (difference > 0) return 85 + (difference * 2);

    // At network average = 75
    if (Math.abs(difference) < 1) return 75;

    // Below average = scaled down
    const belowAverageScore = 75 + (difference * 3); // Penalize more heavily
    return Math.max(0, Math.min(75, belowAverageScore));
  }

  private calculateResponseScore(yourResponseTime: number, networkAverage: number): number {
    // Lower response time is better
    const ratio = yourResponseTime / networkAverage;

    // 2x faster than average = 100
    if (ratio <= 0.5) return 100;

    // Faster than average = 80-99
    if (ratio < 1) return 80 + ((1 - ratio) * 40);

    // At average = 70
    if (ratio <= 1.2) return 70;

    // Slower than average = scaled down
    const slowerScore = 70 - ((ratio - 1) * 30);
    return Math.max(0, Math.min(70, slowerScore));
  }

  private calculatePercentile(score: number): number {
    // Simplified percentile calculation
    // In production, query actual distribution from database

    if (score >= 95) return 95 + (score - 95); // Top 5%
    if (score >= 85) return 75 + ((score - 85) * 2); // Top 25%
    if (score >= 70) return 40 + ((score - 70) * 2.3); // Top 60%

    return score * 0.57; // Below average
  }

  private determineRank(percentile: number): string {
    if (percentile >= 90) return 'Excellent';
    if (percentile >= 75) return 'Good';
    if (percentile >= 50) return 'Average';
    if (percentile >= 25) return 'Below Average';
    return 'Needs Improvement';
  }

  private generateInsights(
    nodeMetrics: any,
    networkBenchmark: NetworkBenchmark,
    percentile: number
  ): string[] {
    const insights: string[] = [];

    // Uptime insights
    const uptimeDiff = nodeMetrics.uptime - networkBenchmark.averageUptime;
    if (uptimeDiff >= 5) {
      insights.push(`Outstanding uptime - ${uptimeDiff.toFixed(1)}% above network average`);
    } else if (uptimeDiff >= 2) {
      insights.push(`Solid uptime performance - above ${Math.round(networkBenchmark.averageUptime)}% network average`);
    } else if (uptimeDiff < -3) {
      insights.push(`Uptime needs improvement - ${Math.abs(uptimeDiff).toFixed(1)}% below network average`);
    }

    // Response time insights
    const responseDiff = networkBenchmark.averageResponseTime - nodeMetrics.avgResponseTime;
    if (responseDiff > 200) {
      insights.push(`Excellent response time - ${responseDiff}ms faster than average`);
    } else if (responseDiff < -300) {
      insights.push(`Response time slower than network - consider optimizing connection`);
    }

    // Percentile insight
    if (percentile >= 90) {
      insights.push(`You're in the top ${100 - percentile}% of all ${networkBenchmark.network} operators`);
    } else if (percentile >= 75) {
      insights.push(`Performing better than ${percentile}% of ${networkBenchmark.network} nodes`);
    } else if (percentile < 40) {
      insights.push(`Room for improvement - currently below median performance`);
    }

    // Sample size insight
    if (nodeMetrics.totalChecks < 20) {
      insights.push('Limited data - score will become more accurate over time');
    }

    return insights;
  }

  /**
   * Get leaderboard position among all nodes
   */
  async getLeaderboardPosition(nodeId: string): Promise<{
    position: number;
    totalNodes: number;
    topPerformers: Array<{ name: string; score: number }>;
  }> {
    // This would query all nodes and rank them
    // Simplified for now
    return {
      position: Math.floor(Math.random() * 100) + 1,
      totalNodes: 1247,
      topPerformers: [
        { name: 'Helium Hotspot Pro', score: 98 },
        { name: 'Tokyo Render Node', score: 96 },
        { name: 'Berlin Gateway', score: 95 },
      ],
    };
  }
}
