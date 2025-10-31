'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Server, Zap, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nodeName: '',
    network: '',
    endpoint: '',
    checkInterval: '300',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit and redirect
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nodeName,
          network: formData.network,
          endpoint: formData.endpoint,
          checkInterval: parseInt(formData.checkInterval),
          config: {},
        }),
      });

      if (response.ok) {
        router.push('/nodes');
      }
    } catch (error) {
      console.error('Error creating node:', error);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.network !== '';
    if (step === 2) return formData.nodeName !== '' && formData.endpoint !== '';
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Step {step} of 3</span>
            <span className="text-sm text-slate-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              {step === 1 && 'Choose Your Network'}
              {step === 2 && 'Configure Your Node'}
              {step === 3 && 'You\'re All Set!'}
            </CardTitle>
            <p className="text-sm text-slate-600">
              {step === 1 && 'Select which DePIN network you want to monitor'}
              {step === 2 && 'Provide your node details for monitoring'}
              {step === 3 && 'Your node will be monitored automatically'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Network Selection */}
            {step === 1 && (
              <div className="grid gap-4">
                {[
                  { value: 'helium', name: 'Helium', desc: 'Hotspots and IoT devices' },
                  { value: 'render', name: 'Render Network', desc: 'GPU compute nodes' },
                  { value: 'arweave', name: 'Arweave', desc: 'Storage gateways' },
                  { value: 'generic', name: 'Custom HTTP', desc: 'Generic endpoints' },
                ].map((network) => (
                  <button
                    key={network.value}
                    onClick={() => setFormData({ ...formData, network: network.value })}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                      formData.network === network.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        formData.network === network.value
                          ? 'bg-green-600'
                          : 'bg-slate-100'
                      }`}
                    >
                      <Server
                        className={`h-5 w-5 ${
                          formData.network === network.value ? 'text-white' : 'text-slate-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{network.name}</div>
                      <div className="text-sm text-slate-600">{network.desc}</div>
                    </div>
                    {formData.network === network.value && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Node Configuration */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nodeName" className="text-slate-700">
                    Node Name
                  </Label>
                  <Input
                    id="nodeName"
                    placeholder="e.g., My Main Helium Hotspot"
                    value={formData.nodeName}
                    onChange={(e) => setFormData({ ...formData, nodeName: e.target.value })}
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endpoint" className="text-slate-700">
                    API Endpoint
                  </Label>
                  <Input
                    id="endpoint"
                    placeholder="https://api.example.com/node/status"
                    value={formData.endpoint}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                    className="border-slate-300"
                  />
                  <p className="text-xs text-slate-500">
                    The URL we'll check to monitor your node's health
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interval" className="text-slate-700">
                    Check Interval
                  </Label>
                  <Select
                    value={formData.checkInterval}
                    onValueChange={(value) => setFormData({ ...formData, checkInterval: value })}
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">Every minute</SelectItem>
                      <SelectItem value="300">Every 5 minutes</SelectItem>
                      <SelectItem value="900">Every 15 minutes</SelectItem>
                      <SelectItem value="3600">Every hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Your node is being monitored!
                </h3>
                <p className="text-slate-600 mb-6">
                  Health checks will run automatically. You'll get AI-powered insights and
                  predictive alerts.
                </p>

                <div className="grid gap-4 text-left max-w-md mx-auto">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <Zap className="h-5 w-5 text-violet-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-slate-900">
                        Predictive Alerts
                      </div>
                      <div className="text-xs text-slate-600">
                        We'll warn you 6+ hours before failures
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-slate-900">
                        Health Score
                      </div>
                      <div className="text-xs text-slate-600">
                        See how you rank vs the network
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <Server className="h-5 w-5 text-slate-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-slate-900">
                        Earnings Optimizer
                      </div>
                      <div className="text-xs text-slate-600">
                        Get recommendations to increase revenue
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => step > 1 && setStep(step - 1)}
                disabled={step === 1}
                className="border-slate-300"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-green-600 hover:bg-green-700"
              >
                {step === 3 ? (
                  <>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        {step < 3 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/nodes')}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Skip onboarding
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
