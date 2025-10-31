'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Server,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  BarChart3,
  Bell,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Globe,
  Activity,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 dark:bg-blue-600">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">NodePulse</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-blue-400 transition-colors">
                Features
              </Link>
              <Link href="https://github.com/nodepulse" target="_blank" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-blue-400 transition-colors">
                GitHub
              </Link>
              <Link href="https://docs.nodepulse.io" target="_blank" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-blue-400 transition-colors">
                Docs
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 pt-16">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-violet-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-200 dark:border-blue-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 dark:bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500 dark:bg-blue-500"></span>
                </span>
                AI-Powered DePIN Operations Platform
                <Sparkles className="h-4 w-4 text-green-600 dark:text-blue-400" />
              </div>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl lg:text-7xl"
            >
              Intelligent Monitoring for{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-blue-500 dark:to-cyan-500 bg-clip-text text-transparent">
                DePIN Infrastructure
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400"
            >
              The only platform that doesn't just monitor your nodes—it optimizes them.
              Predict failures before they happen. Maximize earnings with AI-powered insights.
              Benchmark against the network.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-green-600 dark:bg-blue-600 hover:bg-green-700 dark:hover:bg-blue-700 shadow-lg shadow-green-500/20 dark:shadow-blue-500/20 transition-all hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-800 backdrop-blur-sm"
                >
                  See Features
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-blue-400" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-blue-400" />
                <span>Self-hosted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-blue-400" />
                <span>Open source</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating illustration elements */}
          <div className="absolute top-20 left-10 hidden lg:block">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 dark:from-blue-500 dark:to-cyan-500 p-4 shadow-2xl shadow-green-500/30 dark:shadow-blue-500/30"
            >
              <Server className="h-8 w-8 text-white" />
            </motion.div>
          </div>

          <div className="absolute top-40 right-16 hidden lg:block">
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 dark:from-cyan-500 dark:to-blue-500 p-4 shadow-2xl shadow-violet-500/30 dark:shadow-cyan-500/30"
            >
              <Brain className="h-8 w-8 text-white" />
            </motion.div>
          </div>

          <div className="absolute bottom-20 right-32 hidden lg:block">
            <motion.div
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 dark:from-violet-500 dark:to-purple-500 p-4 shadow-2xl shadow-amber-500/30 dark:shadow-violet-500/30"
            >
              <TrendingUp className="h-8 w-8 text-white" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-4"
          >
            {[
              { value: '4', label: 'DePIN Networks', sublabel: 'Helium, Render, Arweave, Custom', color: 'text-slate-900 dark:text-slate-100' },
              { value: '23%', label: 'Avg Earnings Increase', sublabel: 'With optimization recommendations', color: 'text-green-600 dark:text-blue-400' },
              { value: '87%', label: 'Prediction Accuracy', sublabel: 'AI-powered failure detection', color: 'text-violet-600 dark:text-cyan-400' },
              { value: '< 60s', label: 'Deploy Time', sublabel: 'Docker one-command setup', color: 'text-slate-900 dark:text-slate-100' },
            ].map((stat, index) => (
              <motion.div key={index} variants={scaleIn} className="text-center">
                <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">{stat.sublabel}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 dark:bg-slate-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Beyond Basic Monitoring
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              While others just tell you if your node is up, we tell you how to make more money.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mx-auto mt-16 grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: Brain,
                title: 'Predictive Failure Detection',
                description: 'AI predicts failures 6+ hours before they happen. Get alerts with 87% confidence so you can prevent downtime and lost earnings.',
                badge: 'Powered by ML',
                iconBg: 'bg-violet-100 dark:bg-violet-950',
                iconColor: 'text-violet-600 dark:text-violet-400',
                badgeColor: 'text-violet-600 dark:text-violet-400',
                badgeIcon: Zap,
              },
              {
                icon: TrendingUp,
                title: 'Earnings Optimizer',
                description: 'Get actionable recommendations to increase revenue. Compare ROI across networks. Know exactly which changes will make you the most money.',
                badge: 'Avg +23% earnings',
                iconBg: 'bg-green-100 dark:bg-blue-950',
                iconColor: 'text-green-600 dark:text-blue-400',
                badgeColor: 'text-green-600 dark:text-blue-400',
                badgeIcon: ArrowRight,
              },
              {
                icon: BarChart3,
                title: 'Network Health Score',
                description: 'See how you rank against thousands of operators. Top 15%? Top 50%? Competitive benchmarking shows exactly where you stand.',
                badge: 'Compare vs network',
                iconBg: 'bg-slate-100 dark:bg-slate-800',
                iconColor: 'text-slate-700 dark:text-slate-300',
                badgeColor: 'text-slate-600 dark:text-slate-400',
                badgeIcon: Globe,
              },
              {
                icon: GitBranch,
                title: 'Multi-Network Support',
                description: 'Monitor Helium, Render, Arweave, and custom nodes in ONE dashboard. Specialized adapters understand each network\'s unique metrics.',
                badge: 'Unified dashboard',
                iconBg: 'bg-green-100 dark:bg-blue-950',
                iconColor: 'text-green-600 dark:text-blue-400',
                badgeColor: 'text-green-600 dark:text-blue-400',
                badgeIcon: Server,
              },
              {
                icon: Bell,
                title: 'Intelligent Alerts',
                description: 'Not just "node is down" alerts. Get predictive warnings, anomaly detection, and actionable recommendations via Discord, Telegram, or webhooks.',
                badge: 'Prevent lost earnings',
                iconBg: 'bg-red-100 dark:bg-red-950',
                iconColor: 'text-red-600 dark:text-red-400',
                badgeColor: 'text-red-600 dark:text-red-400',
                badgeIcon: Shield,
              },
              {
                icon: Zap,
                title: 'Real-Time Updates',
                description: 'Server-Sent Events push updates instantly. Sub-second latency. No polling waste. Watch your infrastructure in real-time.',
                badge: 'Live monitoring',
                iconBg: 'bg-violet-100 dark:bg-cyan-950',
                iconColor: 'text-violet-600 dark:text-cyan-400',
                badgeColor: 'text-violet-600 dark:text-cyan-400',
                badgeIcon: Activity,
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                  <CardContent className="p-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.iconBg}`}>
                      <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                    <div className={`mt-4 flex items-center gap-2 text-sm font-medium ${feature.badgeColor}`}>
                      <span>{feature.badge}</span>
                      <feature.badgeIcon className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Deploy in Under 60 Seconds
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Production-ready monitoring with one command. No complex setup required.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mx-auto mt-16 max-w-4xl"
          >
            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Deploy with Docker',
                  description: 'docker-compose up -d and you\'re live in 60 seconds',
                },
                {
                  step: '2',
                  title: 'Add Your Nodes',
                  description: 'Connect your Helium hotspots, Render GPUs, Arweave gateways, or custom endpoints',
                },
                {
                  step: '3',
                  title: 'Get AI-Powered Insights',
                  description: 'Immediately see health scores, earnings optimization, and predictive alerts',
                },
              ].map((item, index) => (
                <motion.div key={index} variants={fadeInUp} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-green-600 dark:border-blue-500 bg-white dark:bg-slate-900 text-sm font-bold text-green-600 dark:text-blue-400 shadow-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {item.step === '1' ? (
                        <>
                          <code className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 text-sm text-green-600 dark:text-blue-400">
                            docker-compose up -d
                          </code>
                          {' '}and you're live in 60 seconds
                        </>
                      ) : (
                        item.description
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-blue-950 dark:to-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Ready to Optimize Your DePIN Operations?
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Join operators who increased earnings by 23% with intelligent monitoring.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-green-600 dark:bg-blue-600 hover:bg-green-700 dark:hover:bg-blue-700 shadow-xl shadow-green-500/30 dark:shadow-blue-500/30 transition-all hover:scale-105"
                >
                  Start Monitoring Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://github.com/nodepulse" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  View on GitHub
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 NodePulse. Open source under MIT License.
            </div>
            <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/dashboard" className="hover:text-green-600 dark:hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
              <Link href="https://github.com/nodepulse" className="hover:text-green-600 dark:hover:text-blue-400 transition-colors" target="_blank">
                GitHub
              </Link>
              <Link href="https://docs.nodepulse.io" className="hover:text-green-600 dark:hover:text-blue-400 transition-colors" target="_blank">
                Docs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
