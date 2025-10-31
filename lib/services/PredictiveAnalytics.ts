import { INode } from '@/lib/types/node';
import HealthCheck from '@/lib/db/models/HealthCheck';

interface PredictiveAlert {
  type: 'predicted_failure' | 'predicted_degradation' | 'predicted_recovery';
  confidence: number; // 0-1
  timeframe: string;
  reason: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
  dataPoints: number;
  trend: 'improving' | 'stable' | 'declining';
}

interface PerformanceTrend {
  metric: string;
  current: number;
  predicted: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

export class PredictiveAnalytics {
  /**
   * Predict potential failures before they happen using simple ML
   */
  async predictFailure(node: INode): Promise<PredictiveAlert | null> {
    // Get recent health check history
    const checks = await HealthCheck.find({ nodeId: node._id })
      .sort({ checkedAt: -1 })
      .limit(50)
      .lean();

    if (checks.length < 10) {
      return null; // Not enough data
    }

    // Analyze trends
    const responseTimeTrend = this.calculateTrend(
      checks.map(c => c.responseTime)
    );

    const failureRate = this.calculateFailureRate(checks);
    const degradationPattern = this.detectDegradationPattern(checks);

    // Predict failure
    if (degradationPattern.isDegrading && degradationPattern.confidence > 0.7) {
      return {
        type: 'predicted_failure',
        confidence: degradationPattern.confidence,
        timeframe: this.estimateTimeToFailure(degradationPattern.rate),
        reason: this.explainPrediction(degradationPattern, responseTimeTrend, failureRate),
        recommendation: this.generateRecommendation(degradationPattern),
        severity: this.determineSeverity(degradationPattern.confidence, degradationPattern.rate),
        dataPoints: checks.length,
        trend: 'declining',
      };
    }

    // Predict degradation (warning)
    if (responseTimeTrend.slope > 50 && responseTimeTrend.correlation > 0.6) {
      return {
        type: 'predicted_degradation',
        confidence: responseTimeTrend.correlation,
        timeframe: 'next 12-24 hours',
        reason: `Response time increasing by ${Math.round(responseTimeTrend.slope)}ms per check`,
        recommendation: 'Monitor closely and prepare for maintenance',
        severity: 'medium',
        dataPoints: checks.length,
        trend: 'declining',
      };
    }

    return null;
  }

  /**
   * Get performance trends for all metrics
   */
  async getPerformanceTrends(nodeId: string): Promise<PerformanceTrend[]> {
    const checks = await HealthCheck.find({ nodeId })
      .sort({ checkedAt: -1 })
      .limit(50)
      .lean();

    if (checks.length < 5) return [];

    const trends: PerformanceTrend[] = [];

    // Response time trend
    const responseTimes = checks.map(c => c.responseTime);
    const rtTrend = this.calculateTrend(responseTimes);
    const currentRT = responseTimes[0];
    const predictedRT = currentRT + (rtTrend.slope * 10); // Predict 10 checks ahead

    trends.push({
      metric: 'Response Time',
      current: Math.round(currentRT),
      predicted: Math.round(predictedRT),
      change: ((predictedRT - currentRT) / currentRT) * 100,
      trend: rtTrend.slope > 10 ? 'up' : rtTrend.slope < -10 ? 'down' : 'stable',
      confidence: Math.abs(rtTrend.correlation),
    });

    // Success rate trend
    const recentSuccess = checks.slice(0, 10).filter(c => c.status === 'success').length / 10;
    const olderSuccess = checks.slice(10, 20).filter(c => c.status === 'success').length / 10;
    const successChange = recentSuccess - olderSuccess;

    trends.push({
      metric: 'Success Rate',
      current: Math.round(recentSuccess * 100),
      predicted: Math.round(Math.min(100, Math.max(0, (recentSuccess + successChange) * 100))),
      change: successChange * 100,
      trend: successChange > 0.05 ? 'up' : successChange < -0.05 ? 'down' : 'stable',
      confidence: 0.75,
    });

    return trends;
  }

  /**
   * Calculate linear regression trend
   */
  private calculateTrend(values: number[]): {
    slope: number;
    intercept: number;
    correlation: number;
  } {
    const n = values.length;
    if (n < 2) return { slope: 0, intercept: values[0] || 0, correlation: 0 };

    // Reverse to get chronological order (oldest first)
    const chronological = [...values].reverse();

    // Calculate means
    const xMean = (n - 1) / 2; // indices from 0 to n-1
    const yMean = chronological.reduce((sum, val) => sum + val, 0) / n;

    // Calculate slope and intercept
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (chronological[i] - yMean);
      denominator += Math.pow(i - xMean, 2);
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;

    // Calculate correlation coefficient
    let ssRes = 0;
    let ssTot = 0;

    for (let i = 0; i < n; i++) {
      const predicted = slope * i + intercept;
      ssRes += Math.pow(chronological[i] - predicted, 2);
      ssTot += Math.pow(chronological[i] - yMean, 2);
    }

    const correlation = ssTot === 0 ? 0 : Math.sqrt(1 - ssRes / ssTot);

    return { slope, intercept, correlation };
  }

  private calculateFailureRate(checks: any[]): number {
    const failures = checks.filter(c => c.status === 'failure').length;
    return failures / checks.length;
  }

  private detectDegradationPattern(checks: any[]): {
    isDegrading: boolean;
    confidence: number;
    rate: number;
  } {
    // Check last 20 vs previous 20
    const recent = checks.slice(0, 20);
    const previous = checks.slice(20, 40);

    if (previous.length < 10) {
      return { isDegrading: false, confidence: 0, rate: 0 };
    }

    const recentFailures = recent.filter(c => c.status === 'failure').length / recent.length;
    const previousFailures = previous.filter(c => c.status === 'failure').length / previous.length;

    const recentAvgRT = recent.reduce((sum, c) => sum + c.responseTime, 0) / recent.length;
    const previousAvgRT = previous.reduce((sum, c) => sum + c.responseTime, 0) / previous.length;

    // Degradation indicators
    const failureRateIncrease = recentFailures - previousFailures;
    const responseTimeIncrease = (recentAvgRT - previousAvgRT) / previousAvgRT;

    const isDegrading = failureRateIncrease > 0.15 || responseTimeIncrease > 0.3;

    // Confidence based on multiple factors
    let confidence = 0;
    if (failureRateIncrease > 0.2) confidence += 0.4;
    else if (failureRateIncrease > 0.1) confidence += 0.2;

    if (responseTimeIncrease > 0.5) confidence += 0.4;
    else if (responseTimeIncrease > 0.3) confidence += 0.2;

    if (recentFailures > 0.3) confidence += 0.2;

    const rate = Math.max(failureRateIncrease, responseTimeIncrease);

    return {
      isDegrading,
      confidence: Math.min(1, confidence),
      rate,
    };
  }

  private estimateTimeToFailure(degradationRate: number): string {
    if (degradationRate > 0.5) return 'next 2-4 hours';
    if (degradationRate > 0.3) return 'next 6-12 hours';
    if (degradationRate > 0.2) return 'next 12-24 hours';
    return 'next 24-48 hours';
  }

  private explainPrediction(
    degradation: any,
    responseTrend: any,
    failureRate: number
  ): string {
    const reasons: string[] = [];

    if (degradation.rate > 0.3) {
      reasons.push('Significant performance degradation detected');
    }

    if (responseTrend.slope > 100) {
      reasons.push(`Response time increasing rapidly (+${Math.round(responseTrend.slope)}ms per check)`);
    }

    if (failureRate > 0.2) {
      reasons.push(`High recent failure rate (${Math.round(failureRate * 100)}%)`);
    }

    if (degradation.confidence > 0.85) {
      reasons.push('Pattern matches historical pre-failure signatures');
    }

    return reasons.join('. ') || 'Performance metrics trending towards failure threshold';
  }

  private generateRecommendation(degradation: any): string {
    if (degradation.rate > 0.4) {
      return 'URGENT: Restart node immediately to prevent failure and lost earnings';
    }

    if (degradation.rate > 0.3) {
      return 'Restart node within next 2 hours to prevent downtime';
    }

    if (degradation.rate > 0.2) {
      return 'Schedule maintenance in next 6-12 hours. Monitor closely.';
    }

    return 'Increase monitoring frequency and prepare for potential intervention';
  }

  private determineSeverity(confidence: number, rate: number): 'low' | 'medium' | 'high' {
    if (confidence > 0.8 && rate > 0.3) return 'high';
    if (confidence > 0.6 && rate > 0.2) return 'medium';
    return 'low';
  }

  /**
   * Get anomaly score (how unusual current behavior is)
   */
  async getAnomalyScore(nodeId: string): Promise<{
    score: number; // 0-100, higher = more anomalous
    isAnomalous: boolean;
    factors: string[];
  }> {
    const checks = await HealthCheck.find({ nodeId })
      .sort({ checkedAt: -1 })
      .limit(100)
      .lean();

    if (checks.length < 20) {
      return { score: 0, isAnomalous: false, factors: [] };
    }

    const recent = checks.slice(0, 10);
    const baseline = checks.slice(10);

    // Calculate baseline statistics
    const baselineRT = baseline.map(c => c.responseTime);
    const baselineMean = baselineRT.reduce((sum, val) => sum + val, 0) / baselineRT.length;
    const baselineStdDev = Math.sqrt(
      baselineRT.reduce((sum, val) => sum + Math.pow(val - baselineMean, 2), 0) / baselineRT.length
    );

    // Check recent values against baseline
    let anomalyScore = 0;
    const factors: string[] = [];

    const recentMean = recent.reduce((sum, c) => sum + c.responseTime, 0) / recent.length;
    const zScore = Math.abs((recentMean - baselineMean) / baselineStdDev);

    if (zScore > 3) {
      anomalyScore += 40;
      factors.push('Response time significantly outside normal range');
    } else if (zScore > 2) {
      anomalyScore += 25;
      factors.push('Response time moderately unusual');
    }

    // Failure rate anomaly
    const recentFailures = recent.filter(c => c.status === 'failure').length / recent.length;
    const baselineFailures = baseline.filter(c => c.status === 'failure').length / baseline.length;

    if (recentFailures > baselineFailures * 3) {
      anomalyScore += 40;
      factors.push('Failure rate 3x higher than normal');
    } else if (recentFailures > baselineFailures * 2) {
      anomalyScore += 25;
      factors.push('Failure rate significantly elevated');
    }

    // Consecutive failures
    const consecutiveFailures = this.countConsecutiveFailures(recent);
    if (consecutiveFailures >= 3) {
      anomalyScore += 30;
      factors.push(`${consecutiveFailures} consecutive failures detected`);
    }

    return {
      score: Math.min(100, anomalyScore),
      isAnomalous: anomalyScore > 50,
      factors,
    };
  }

  private countConsecutiveFailures(checks: any[]): number {
    let count = 0;
    for (const check of checks) {
      if (check.status === 'failure') count++;
      else break;
    }
    return count;
  }
}
