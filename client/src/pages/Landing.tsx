/**
 * Landing Page - Modern Minimalist with Motion
 * Design Philosophy: Clean, purposeful design with strategic animations
 * Color Scheme: Deep indigo (#2563EB) + Vibrant cyan (#06B6D4)
 * Typography: Space Mono (display) + Inter (body)
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Sparkles, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: "0px 0px -100px 0px" },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1 },
  viewport: { once: true, margin: "0px 0px -100px 0px" },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-display font-bold text-xl text-slate-900">Aks Clip</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Pricing
            </a>
            <a href="/app/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 -z-10" />
        
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                ✨ AI-Powered Video Clipper
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 leading-tight">
              Transform Long Videos Into <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Viral Clips</span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              Automatically detect the best moments in your videos and create short-form content for TikTok, Instagram Reels, and YouTube Shorts using advanced AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="/app/create" className="inline-block">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>

            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
              <div>
                <div className="text-2xl font-bold text-slate-900">4</div>
                <p className="text-sm text-slate-600">Whisper Models</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">Unlimited</div>
                <p className="text-sm text-slate-600">Pro Clips</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">Free</div>
                <p className="text-sm text-slate-600">Lite Plan</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-96 lg:h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-3xl blur-3xl" />
            <img
              src="/images/hero-bg.png"
              alt="Video transformation visualization"
              className="relative w-full h-full object-cover rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to create viral short-form content automatically
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* AI Detection */}
            <motion.div {...fadeInUp}>
              <Card className="h-full p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                  AI-Powered Detection
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Advanced algorithms automatically identify the most engaging moments in your videos
                </p>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <img src="/images/feature-ai.png" alt="AI detection" className="w-full h-40 object-cover rounded-lg" />
                </div>
              </Card>
            </motion.div>

            {/* Speed */}
            <motion.div {...fadeInUp}>
              <Card className="h-full p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                  Lightning Fast
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Process videos in minutes with multiple Whisper models for speed/accuracy tradeoffs
                </p>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <img src="/images/feature-speed.png" alt="Speed" className="w-full h-40 object-cover rounded-lg" />
                </div>
              </Card>
            </motion.div>

            {/* Social Ready */}
            <motion.div {...fadeInUp}>
              <Card className="h-full p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                  <Share2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                  Social Ready
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Auto-generated metadata, subtitles, and hashtags for TikTok, Instagram, and YouTube
                </p>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <img src="/images/feature-social.png" alt="Social media" className="w-full h-40 object-cover rounded-lg" />
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Whisper Models Section */}
      <section className="py-32 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              Choose Your Speed
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Select from 4 Whisper models optimized for different use cases
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { name: "Tiny", speed: "⚡ Very Fast", accuracy: "Good", use: "Quick previews" },
              { name: "Base", speed: "⚡⚡ Fast", accuracy: "Very Good", use: "Balanced use" },
              { name: "Small", speed: "⚡⚡⚡ Normal", accuracy: "Excellent", use: "High quality" },
              { name: "Medium", speed: "⚡⚡⚡⚡ Slow", accuracy: "Best", use: "Professional" },
            ].map((model) => (
              <motion.div key={model.name} {...fadeInUp}>
                <Card className="p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-4">
                    {model.name}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">Speed</p>
                      <p className="text-slate-900 font-medium">{model.speed}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Accuracy</p>
                      <p className="text-slate-900 font-medium">{model.accuracy}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Best for</p>
                      <p className="text-slate-900 font-medium">{model.use}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Lite Plan */}
            <motion.div {...fadeInUp}>
              <Card className="p-8 border border-slate-200 bg-white h-full flex flex-col">
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                  Lite
                </h3>
                <p className="text-slate-600 mb-6">Perfect for getting started</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">Free</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    15 clips per month
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    Banner ads
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    4 Whisper models
                  </li>
                  <li className="flex items-center gap-3 text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-sm">✗</span>
                    </div>
                    <span className="line-through">Auto metadata</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-sm">✗</span>
                    </div>
                    <span className="line-through">Subtitles</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-50">
                  Get Started
                </Button>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div {...fadeInUp}>
              <Card className="p-8 border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  Popular
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                  Pro
                </h3>
                <p className="text-slate-600 mb-6">For serious creators</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">Rp 99.000</span>
                  <span className="text-slate-600 ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    Unlimited clips
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    No video ads
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    4 Whisper models
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    Auto titles & descriptions
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    Auto subtitles
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Upgrade to Pro
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to Create Viral Clips?
            </h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Start for free with the Lite plan. Upgrade to Pro anytime to unlock unlimited clips and advanced features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 font-semibold">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="font-display font-bold text-white">Clipper</span>
              </div>
              <p className="text-sm">AI-powered video clipper for social media</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="https://github.com/Akskuy/clipper" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2024 Clipper. All rights reserved.</p>
            <p className="text-sm">Made with ❤️ by Akskuy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
