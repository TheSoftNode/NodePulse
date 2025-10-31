'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Award, AlertTriangle, TrendingDown, Minus, Zap } from 'lucide-react';

interface NodeInsightsPanelProps {
  nodeId: string;
}

export function NodeInsightsPanel({ nodeId }: NodeInsightsPanelProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [nodeId]);

  const fetchInsights = async () => {
    try {
      const response = await fetch(`/api/nodes/${nodeId}/insights`);
      if (response.ok) {
        const data = await response.json();
        setInsights(data.data);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        Unable to load insights. Please try again.
      </div>
    );
  }

  const { healthScore, earningsOptimization, predictiveAlert, performanceTrends, anomalyScore } = insights;

  return (
    <div className="space-y-6">
      {/* Predictive Alert - If exists, show prominently */}
      {predictiveAlert && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              Predictive Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-900 dark:text-red-100">
                {predictiveAlert.type === 'predicted_failure' ? 'Failure Predicted' : 'Performance Degradation'}
              </span>
              <Badge variant="destructive" className="dark:bg-red-900 dark:text-red-100">
                {Math.round(predictiveAlert.confidence * 100)}% Confidence
              </Badge>
            </div>
            <p className="text-sm text-red-800 dark:text-red-200">{predictiveAlert.reason}</p>
            <div className="rounded-lg bg-white dark:bg-red-900 border border-red-200 dark:border-red-800 p-3">
              <div className="text-xs font-medium text-red-900 dark:text-red-100 mb-1">Recommendation:</div>
              <div className="text-sm text-red-800 dark:text-red-200">{predictiveAlert.recommendation}</div>
            </div>
            <div className="text-xs text-red-700 dark:text-red-300">
              Expected timeframe: <strong>{predictiveAlert.timeframe}</strong>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Health Score Card */}
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Award className="h-5 w-5 text-violet-600 dark:text-cyan-400" />
              Network Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="text-5xl font-bold text-slate-900 dark:text-slate-100">{healthScore.score}</div>
              <div className="text-lg text-slate-600 dark:text-slate-400 pb-2">/100</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Network Rank</span>
                <Badge
                  variant={
                    healthScore.rank === 'Excellent'
                      ? 'default'
                      : healthScore.rank === 'Good'
                      ? 'secondary'
                      : 'outline'
                  }
                  className={
                    healthScore.rank === 'Excellent'
                      ? 'bg-green-100 dark:bg-blue-950 text-green-800 dark:text-blue-400 border-green-200 dark:border-blue-800'
                      : healthScore.rank === 'Good'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                      : ''
                  }
                >
                  {healthScore.rank}
                </Badge>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400">
                Top <strong className="text-slate-900 dark:text-slate-100">{100 - healthScore.percentile}%</strong> of operators
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
              {healthScore.insights.slice(0, 2).map((insight: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="text-green-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Earnings Optimization Card */}
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-blue-400" />
              Earnings Optimizer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Current Monthly</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  ${earningsOptimization.currentMonthlyEarnings}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-600 dark:text-slate-400">Optimization</div>
                <div className="text-2xl font-bold text-green-600 dark:text-blue-400">
                  {earningsOptimization.optimizationScore}%
                </div>
              </div>
            </div>

            {earningsOptimization.recommendations.length > 0 && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Top Recommendation:
                </div>
                <div className="rounded-lg bg-green-50 dark:bg-blue-950 border border-green-200 dark:border-blue-800 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-900 dark:text-blue-100">
                      {earningsOptimization.recommendations[0].action}
                    </span>
                    <Badge variant="outline" className="bg-white dark:bg-blue-900 border-green-300 dark:border-blue-700 text-green-700 dark:text-blue-300">
                      +${earningsOptimization.recommendations[0].potentialGain}
                    </Badge>
                  </div>
                  <p className="text-xs text-green-800 dark:text-blue-200">
                    {earningsOptimization.recommendations[0].impact}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Trends Card */}
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Brain className="h-5 w-5 text-violet-600 dark:text-cyan-400" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {performanceTrends && performanceTrends.length > 0 ? (
              performanceTrends.map((trend: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-2">
                    {trend.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                    ) : trend.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-green-600 dark:text-blue-400" />
                    ) : (
                      <Minus className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    )}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{trend.metric}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{trend.predicted}</div>
                    <div className={`text-xs ${trend.change > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-blue-400'}`}>
                      {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                Collecting data for trends...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Anomaly Detection Card */}
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Zap className="h-5 w-5 text-violet-600 dark:text-cyan-400" />
              Anomaly Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Anomaly Score</span>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{anomalyScore.score}</div>
                <Badge
                  variant={anomalyScore.isAnomalous ? 'destructive' : 'outline'}
                  className={!anomalyScore.isAnomalous ? 'bg-green-50 dark:bg-blue-950 text-green-700 dark:text-blue-400 border-green-200 dark:border-blue-800' : 'dark:bg-red-900 dark:text-red-100'}
                >
                  {anomalyScore.isAnomalous ? 'Unusual' : 'Normal'}
                </Badge>
              </div>
            </div>

            {anomalyScore.factors && anomalyScore.factors.length > 0 && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                {anomalyScore.factors.map((factor: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="text-violet-600 dark:text-cyan-400 mt-0.5">•</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            )}

            {!anomalyScore.isAnomalous && (
              <div className="text-xs text-slate-600 dark:text-slate-400 pt-2">
                ✓ All metrics within expected ranges
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alternative Networks Comparison */}
      {earningsOptimization.alternativeNetworks && earningsOptimization.alternativeNetworks.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Network ROI Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {earningsOptimization.alternativeNetworks.map((alt: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100 capitalize">{alt.network}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{alt.recommendation}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">${alt.projectedEarnings}</div>
                    <div className={`text-sm font-medium ${alt.comparisonPercent > 0 ? 'text-green-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                      {alt.comparisonPercent > 0 ? '+' : ''}{alt.comparisonPercent}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
