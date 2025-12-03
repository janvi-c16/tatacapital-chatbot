"use client";

import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

interface EMICalculatorProps {
  initialAmount?: number;
  initialTenure?: number;
  initialRate?: number;
}

export function EMICalculator({ 
  initialAmount = 500000, 
  initialTenure = 24,
  initialRate = 10.5 
}: EMICalculatorProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [tenure, setTenure] = useState(initialTenure);
  const [rate, setRate] = useState(initialRate);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, [amount, tenure, rate]);

  const calculateEMI = () => {
    const monthlyRate = rate / (12 * 100);
    const calculatedEMI = 
      (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);
    
    const total = calculatedEMI * tenure;
    const interest = total - amount;

    setEmi(Math.round(calculatedEMI));
    setTotalInterest(Math.round(interest));
    setTotalAmount(Math.round(total));
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-purple-600" />
          EMI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Loan Amount</label>
            <span className="text-sm font-semibold text-purple-600">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
          <Slider
            value={[amount]}
            onValueChange={(value) => setAmount(value[0])}
            min={50000}
            max={2500000}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹50K</span>
            <span>₹25L</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Tenure</label>
            <span className="text-sm font-semibold text-purple-600">
              {tenure} months
            </span>
          </div>
          <Slider
            value={[tenure]}
            onValueChange={(value) => setTenure(value[0])}
            min={12}
            max={60}
            step={6}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>12 months</span>
            <span>60 months</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Interest Rate</label>
            <span className="text-sm font-semibold text-purple-600">
              {rate.toFixed(1)}% p.a.
            </span>
          </div>
          <Slider
            value={[rate]}
            onValueChange={(value) => setRate(value[0])}
            min={8.5}
            max={18}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>8.5%</span>
            <span>18%</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-purple-50 rounded-lg p-4 space-y-3 border border-purple-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly EMI</span>
            <span className="text-2xl font-bold text-purple-600">
              ₹{emi.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="border-t border-purple-200 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Principal Amount</span>
              <span className="font-semibold">₹{amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Interest</span>
              <span className="font-semibold text-orange-600">
                ₹{totalInterest.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Payable</span>
              <span className="font-semibold text-green-600">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
