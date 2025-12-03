"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle, Clock, Shield, TrendingUp } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                <span className="text-purple-700 font-bold text-4xl">T</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Tata Capital
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-purple-200 mb-4">
              AI-Powered Personal Loans
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
              Get instant loan approval with our intelligent chatbot. 
              Apply in minutes, get decisions in real-time.
            </p>

            {/* CTA Button */}
            <Button
              onClick={() => router.push('/chat')}
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-50 text-xl px-12 py-8 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              Start Chat & Apply Now
            </Button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-16 text-purple-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">100% Digital</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Instant Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure & Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Low Interest Rates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Our AI Loan Assistant?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Chat
              </h3>
              <p className="text-gray-600">
                Intelligent conversation flow that understands your needs and guides you through the process.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Instant Decisions
              </h3>
              <p className="text-gray-600">
                Real-time underwriting with immediate approval or rejection decisions based on your profile.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Verification
              </h3>
              <p className="text-gray-600">
                Automated credit checks and document verification for faster processing.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Competitive Rates
              </h3>
              <p className="text-gray-600">
                Interest rates starting from 9.5% p.a. based on your credit score and profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Details Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Personal Loan Features
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Loan Amount: ₹50,000 - ₹25,00,000</p>
                    <p className="text-gray-600 text-sm">Choose the amount that suits your needs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Tenure: 12 - 60 Months</p>
                    <p className="text-gray-600 text-sm">Flexible repayment options</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Interest Rate: 9.5% - 14.5% p.a.</p>
                    <p className="text-gray-600 text-sm">Based on credit score and employment</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Minimal Documentation</p>
                    <p className="text-gray-600 text-sm">Quick digital verification process</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Multi-Agent AI System
              </h3>
              <p className="text-gray-600 mb-6">
                Our intelligent system uses specialized AI agents for each stage:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <span className="font-semibold text-gray-800">Sales Agent - Collects Details</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <span className="font-semibold text-gray-800">Verification Agent - Checks Profile</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <span className="font-semibold text-gray-800">Underwriting Agent - Makes Decision</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <span className="font-semibold text-gray-800">Sanction Agent - Generates Letter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Your Personal Loan?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start chatting with our AI assistant now and get instant approval!
          </p>
          <Button
            onClick={() => router.push('/chat')}
            size="lg"
            className="bg-white text-purple-700 hover:bg-purple-50 text-xl px-12 py-8 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <MessageSquare className="w-6 h-6 mr-3" />
            Apply Now - It's Free!
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Tata Capital Limited. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            This is a demo application showcasing AI-powered loan processing.
          </p>
        </div>
      </footer>
    </div>
  );
}