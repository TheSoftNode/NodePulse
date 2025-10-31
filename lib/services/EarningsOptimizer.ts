import { INode, NetworkType } from '@/lib/types/node';
import HealthCheck from '@/lib/db/models/HealthCheck';

interface NetworkEarnings {
  network: NetworkType;
  averageMonthlyEarnings: number;
  hardwareRequirement: string;
  setupCost: number;
  monthlyCost: number;
  roi: string;
}

interface EarningsOptimization {
  currentNetwork: NetworkType;
  currentMonthlyEarnings: number;
  recommendations: Array<{
    action: string;
    impact: string;
    potentialGain: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    priority: number;
  }>;
  alternativeNetworks: Array<{
    network: NetworkType;
    projectedEarnings: number;
    comparisonPercent: number;
    recommendation: string;
  }>;
  optimizationScore: number; // 0-100, how optimized current setup is
}

interface ROIComparison {
  current: {
    network: NetworkType;
    monthlyRevenue: number;
    monthlyCost: number;
    netProfit: number;
    roi: number;
  };
  alternatives: Array<{
    network: NetworkType;
    monthlyRevenue: number;
    monthlyCost: number;
    netProfit: number;
    roi: number;
    switchCost: number;
    paybackPeriod: string;
  }>;
  bestAlternative: NetworkType | null;
}

export class EarningsOptimizer {
  /**
   * Analyze node and provide earnings optimization recommendations
   */
  async analyzeEarnings(node: INode): Promise<EarningsOptimization> {
    const nodeMetrics = await this.getNodePerformanceMetrics(node._id);
    const networkData = this.getNetworkEarningsData(node.network);
    const recommendations = this.generateRecommendations(node, nodeMetrics, networkData);
    const alternatives = this.compareNetworks(node.network);
    const optimizationScore = this.calculateOptimizationScore(nodeMetrics, networkData);

    // Get estimated earnings from config or calculate
    const currentMonthlyEarnings = (node.config?.monthlyEarnings as number) ||
      this.estimateEarnings(node.network, nodeMetrics.uptime);

    return {
      currentNetwork: node.network,
      currentMonthlyEarnings,
      recommendations,
      alternativeNetworks: alternatives,
      optimizationScore,
    };
  }

  /**
   * Compare ROI across different networks
   */
  async compareROI(node: INode): Promise<ROIComparison> {
    const currentEarnings = (node.config?.monthlyEarnings as number) || 150;
    const currentCost = (node.config?.monthlyCost as number) || 50;

    const alternatives = this.getNetworkComparisons(node.network);

    return {
      current: {
        network: node.network,
        monthlyRevenue: currentEarnings,
        monthlyCost: currentCost,
        netProfit: currentEarnings - currentCost,
        roi: ((currentEarnings - currentCost) / currentCost) * 100,
      },
      alternatives: alternatives.map(alt => ({
        network: alt.network,
        monthlyRevenue: alt.avgEarnings,
        monthlyCost: alt.monthlyCost,
        netProfit: alt.avgEarnings - alt.monthlyCost,
        roi: ((alt.avgEarnings - alt.monthlyCost) / alt.monthlyCost) * 100,
        switchCost: alt.switchCost,
        paybackPeriod: this.calculatePaybackPeriod(
          alt.switchCost,
          alt.avgEarnings - currentEarnings
        ),
      })),
      bestAlternative: this.findBestAlternative(alternatives, currentEarnings),
    };
  }

  private async getNodePerformanceMetrics(nodeId: string) {
    const checks = await HealthCheck.find({ nodeId })
      .sort({ checkedAt: -1 })
      .limit(168) // Last week (hourly checks)
      .lean();

    const successRate = checks.filter(c => c.status === 'success').length / checks.length;
    const avgResponseTime = checks.reduce((sum, c) => sum + c.responseTime, 0) / checks.length;

    return {
      uptime: successRate * 100,
      avgResponseTime,
      checksPerformed: checks.length,
    };
  }

  private getNetworkEarningsData(network: NetworkType): NetworkEarnings {
    const data: Record<NetworkType, NetworkEarnings> = {
      helium: {
        network: 'helium',
        averageMonthlyEarnings: 125,
        hardwareRequirement: 'Hotspot ($500)',
        setupCost: 500,
        monthlyCost: 15,
        roi: '4-5 months',
      },
      render: {
        network: 'render',
        averageMonthlyEarnings: 800,
        hardwareRequirement: 'High-end GPU ($2000)',
        setupCost: 2000,
        monthlyCost: 120,
        roi: '2-3 months',
      },
      arweave: {
        network: 'arweave',
        averageMonthlyEarnings: 300,
        hardwareRequirement: 'Storage server ($1500)',
        setupCost: 1500,
        monthlyCost: 80,
        roi: '6-7 months',
      },
      generic: {
        network: 'generic',
        averageMonthlyEarnings: 200,
        hardwareRequirement: 'Standard server',
        setupCost: 800,
        monthlyCost: 50,
        roi: '5-6 months',
      },
    };

    return data[network];
  }

  private generateRecommendations(
    node: INode,
    metrics: any,
    networkData: NetworkEarnings
  ) {
    const recommendations: Array<any> = [];

    // Uptime optimization
    if (metrics.uptime < 95) {
      const potentialGain = (95 - metrics.uptime) * (networkData.averageMonthlyEarnings / 100);
      recommendations.push({
        action: 'Improve uptime to 95%',
        impact: `Currently at ${metrics.uptime.toFixed(1)}% - losing earnings during downtime`,
        potentialGain: Math.round(potentialGain),
        difficulty: 'Medium' as const,
        priority: 1,
      });
    }

    // Response time optimization
    if (metrics.avgResponseTime > 2000) {
      recommendations.push({
        action: 'Optimize response time',
        impact: 'Slow response may affect earnings and network rewards',
        potentialGain: Math.round(networkData.averageMonthlyEarnings * 0.1),
        difficulty: 'Medium' as const,
        priority: 2,
      });
    }

    // Network-specific recommendations
    if (node.network === 'helium') {
      recommendations.push({
        action: 'Optimize antenna placement',
        impact: 'Better coverage can increase witnesses and rewards',
        potentialGain: Math.round(networkData.averageMonthlyEarnings * 0.15),
        difficulty: 'Easy' as const,
        priority: 3,
      });
    }

    if (node.network === 'render') {
      recommendations.push({
        action: 'Increase availability during peak hours',
        impact: 'More job assignments during 2-6pm and 8-11pm',
        potentialGain: Math.round(networkData.averageMonthlyEarnings * 0.12),
        difficulty: 'Easy' as const,
        priority: 2,
      });
    }

    // Location-based recommendation
    const location = node.config?.location as string;
    if (location && location.includes('Mumbai')) {
      recommendations.push({
        action: 'Consider relocating to less saturated region',
        impact: 'High operator density in this area reduces earnings potential',
        potentialGain: Math.round(networkData.averageMonthlyEarnings * 0.25),
        difficulty: 'Hard' as const,
        priority: 4,
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  private compareNetworks(currentNetwork: NetworkType) {
    const allNetworks = this.getNetworkComparisons(currentNetwork);

    return allNetworks.map(net => {
      const comparison = ((net.avgEarnings / net.refEarnings) - 1) * 100;

      let recommendation = '';
      if (comparison > 30) {
        recommendation = `Switching to ${net.network} could increase earnings by ${comparison.toFixed(0)}%`;
      } else if (comparison > 10) {
        recommendation = `${net.network} offers moderately better returns`;
      } else if (comparison < -20) {
        recommendation = `Current network performs better than ${net.network}`;
      } else {
        recommendation = 'Similar earnings potential to current network';
      }

      return {
        network: net.network,
        projectedEarnings: net.avgEarnings,
        comparisonPercent: Math.round(comparison),
        recommendation,
      };
    });
  }

  private getNetworkComparisons(currentNetwork: NetworkType) {
    const currentData = this.getNetworkEarningsData(currentNetwork);

    const networks: NetworkType[] = ['helium', 'render', 'arweave', 'generic'];
    return networks
      .filter(n => n !== currentNetwork)
      .map(network => {
        const data = this.getNetworkEarningsData(network);
        return {
          network,
          avgEarnings: data.averageMonthlyEarnings,
          monthlyCost: data.monthlyCost,
          switchCost: data.setupCost,
          refEarnings: currentData.averageMonthlyEarnings,
        };
      });
  }

  private calculateOptimizationScore(metrics: any, networkData: NetworkEarnings): number {
    let score = 0;

    // Uptime component (50 points max)
    if (metrics.uptime >= 99) score += 50;
    else if (metrics.uptime >= 95) score += 40;
    else if (metrics.uptime >= 90) score += 30;
    else score += (metrics.uptime / 90) * 30;

    // Response time component (30 points max)
    if (metrics.avgResponseTime < 500) score += 30;
    else if (metrics.avgResponseTime < 1000) score += 25;
    else if (metrics.avgResponseTime < 2000) score += 15;
    else score += 10;

    // Data availability component (20 points max)
    if (metrics.checksPerformed >= 100) score += 20;
    else score += (metrics.checksPerformed / 100) * 20;

    return Math.min(100, Math.round(score));
  }

  private estimateEarnings(network: NetworkType, uptime: number): number {
    const baseEarnings = this.getNetworkEarningsData(network).averageMonthlyEarnings;
    return Math.round(baseEarnings * (uptime / 100));
  }

  private calculatePaybackPeriod(switchCost: number, monthlyGain: number): string {
    if (monthlyGain <= 0) return 'Not recommended';

    const months = switchCost / monthlyGain;

    if (months < 1) return 'Less than 1 month';
    if (months < 2) return '1-2 months';
    if (months < 3) return '2-3 months';
    if (months < 6) return `${Math.round(months)} months`;
    if (months < 12) return `${Math.round(months)} months`;

    return `${Math.round(months / 12)} years`;
  }

  private findBestAlternative(alternatives: any[], currentEarnings: number): NetworkType | null {
    const best = alternatives
      .filter(alt => alt.avgEarnings > currentEarnings * 1.2) // At least 20% better
      .sort((a, b) => b.avgEarnings - a.avgEarnings)[0];

    return best?.network || null;
  }
}
