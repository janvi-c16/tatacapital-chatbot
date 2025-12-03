"use client";

import { CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoanApplication } from '@/lib/types';

interface ApprovalCardProps {
  application: LoanApplication;
  onDownloadPDF: () => void;
  downloadingPDF: boolean;
}

export function ApprovalCard({ application, onDownloadPDF, downloadingPDF }: ApprovalCardProps) {
  const { decision, sanctionedAmount, interestRate, tenure, emi, conditions, rejectionReason } = application;

  if (!decision) return null;

  const isApproved = decision === 'approved';
  const isConditional = decision === 'conditional';
  const isRejected = decision === 'rejected';

  return (
    <Card className={`w-full border-2 ${
      isApproved ? 'border-green-200 bg-green-50' :
      isConditional ? 'border-yellow-200 bg-yellow-50' :
      'border-red-200 bg-red-50'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          {isApproved && <CheckCircle2 className="w-6 h-6 text-green-600" />}
          {isConditional && <AlertCircle className="w-6 h-6 text-yellow-600" />}
          {isRejected && <XCircle className="w-6 h-6 text-red-600" />}
          <span className={
            isApproved ? 'text-green-700' :
            isConditional ? 'text-yellow-700' :
            'text-red-700'
          }>
            {isApproved && 'Loan Approved!'}
            {isConditional && 'Conditionally Approved'}
            {isRejected && 'Application Rejected'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isRejected && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-xs text-gray-500 mb-1">Sanctioned Amount</p>
                <p className="text-lg font-bold text-purple-600">
                  ₹{sanctionedAmount?.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-xs text-gray-500 mb-1">Monthly EMI</p>
                <p className="text-lg font-bold text-purple-600">
                  ₹{emi?.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                <p className="text-lg font-bold text-purple-600">
                  {interestRate}% p.a.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-xs text-gray-500 mb-1">Tenure</p>
                <p className="text-lg font-bold text-purple-600">
                  {tenure} months
                </p>
              </div>
            </div>

            {isConditional && conditions && conditions.length > 0 && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  ⚠️ Conditions to be met:
                </p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  {conditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-semibold">{index + 1}.</span>
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={onDownloadPDF}
              disabled={downloadingPDF}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {downloadingPDF ? (
                'Generating PDF...'
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Sanction Letter
                </>
              )}
            </Button>
          </>
        )}

        {isRejected && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-800 mb-2">
              Rejection Reason:
            </p>
            <p className="text-sm text-red-700">{rejectionReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
