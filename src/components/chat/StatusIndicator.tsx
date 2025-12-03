"use client";

import { CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';

interface StatusIndicatorProps {
  stage: 'initial' | 'verification' | 'underwriting' | 'sanctioned' | 'rejected';
}

export function StatusIndicator({ stage }: StatusIndicatorProps) {
  const stages = [
    { id: 'initial', label: 'Application Started', icon: CheckCircle2 },
    { id: 'verification', label: 'Verification', icon: Clock },
    { id: 'underwriting', label: 'Underwriting', icon: Clock },
    { id: 'sanctioned', label: 'Decision', icon: CheckCircle2 },
  ];

  const getStageIndex = (currentStage: string) => {
    const index = stages.findIndex(s => s.id === currentStage);
    return index === -1 ? 0 : index;
  };

  const currentIndex = getStageIndex(stage);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Application Progress</h3>
      <div className="flex items-center justify-between">
        {stages.map((stageItem, index) => {
          const Icon = stageItem.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isRejected = stage === 'rejected' && index === stages.length - 1;

          return (
            <div key={stageItem.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isRejected
                      ? 'bg-red-100 text-red-600'
                      : isCompleted
                      ? 'bg-green-100 text-green-600'
                      : isActive
                      ? 'bg-purple-600 text-white animate-pulse'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isRejected ? (
                    <XCircle className="w-5 h-5" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 text-center ${
                    isActive ? 'font-semibold text-purple-600' : 'text-gray-500'
                  }`}
                >
                  {stageItem.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-all ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
