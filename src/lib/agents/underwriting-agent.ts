import { BaseAgent } from './base-agent';
import { AgentResponse, LoanApplication } from '../types';
import { calculateEMI, getInterestRate } from '../mock-data';

export class UnderwritingAgent extends BaseAgent {
  constructor() {
    super('UnderwritingAgent');
  }

  async process(
    message: string,
    application: LoanApplication,
    conversationHistory: any[]
  ): Promise<AgentResponse> {
    this.log(`Underwriting loan application for ${application.customerId}`);
    
    if (!application.creditScore || !application.monthlyIncome || !application.existingLiability) {
      return {
        message: '❌ Unable to process - missing customer profile data.',
        shouldTransfer: false,
      };
    }

    // Business Rules for Loan Underwriting
    const creditScore = application.creditScore;
    const monthlyIncome = application.monthlyIncome;
    const existingLiability = application.existingLiability;
    const requestedAmount = application.requestedAmount;
    const tenure = application.tenure;

    // Calculate EMI
    const interestRate = getInterestRate(creditScore, application.employmentType);
    const emi = calculateEMI(requestedAmount, interestRate, tenure);
    
    // Calculate total liability (existing + new EMI)
    const totalLiability = existingLiability + emi;
    const obligationRatio = (totalLiability / monthlyIncome) * 100;

    this.log(`Credit Score: ${creditScore}, Income: ${monthlyIncome}, Obligation Ratio: ${obligationRatio}%`);

    // Decision Logic
    
    // REJECTION CASE 1: Low Credit Score (< 650)
    if (creditScore < 650) {
      application.decision = 'rejected';
      application.currentStage = 'rejected';
      application.rejectionReason = 'Credit score below minimum requirement';
      
      return {
        message: `❌ Loan Application Rejected\\n\\nWe regret to inform you that your loan application cannot be approved at this time.\\n\\n📊 Decision Details:\\n• Credit Score: ${creditScore} (Minimum required: 650)\\n• Requested Amount: ₹${requestedAmount.toLocaleString('en-IN')}\\n\\n💡 Recommendation:\\nWe recommend improving your credit score by:\\n• Paying existing debts on time\\n• Reducing credit card utilization\\n• Avoiding new loan applications for 6 months\\n\\nYou can reapply after 6 months once your credit score improves.\\n\\nThank you for considering Tata Capital.`,
        shouldTransfer: false,
        completed: true,
        metadata: {
          decision: 'rejected',
          rejectionReason: 'Low credit score',
          creditScore,
        },
      };
    }

    // REJECTION CASE 2: Obligation Ratio Exceeds 60%
    if (obligationRatio > 60) {
      application.decision = 'rejected';
      application.currentStage = 'rejected';
      application.rejectionReason = 'Monthly obligation exceeds 60% of income';
      
      return {
        message: `❌ Loan Application Rejected\\n\\nWe regret to inform you that your loan application cannot be approved at this time.\\n\\n📊 Decision Details:\\n• Monthly Income: ₹${monthlyIncome.toLocaleString('en-IN')}\\n• Existing EMI: ₹${existingLiability.toLocaleString('en-IN')}\\n• Proposed New EMI: ₹${emi.toLocaleString('en-IN')}\\n• Total Obligation: ₹${totalLiability.toLocaleString('en-IN')}\\n• Obligation Ratio: ${obligationRatio.toFixed(1)}% (Maximum allowed: 60%)\\n\\n💡 Recommendation:\\nYour total monthly obligations would exceed our maximum threshold. Consider:\\n• Reducing the loan amount\\n• Closing existing loans\\n• Increasing your income sources\\n\\nYou may reapply with a lower loan amount or after reducing existing liabilities.\\n\\nThank you for considering Tata Capital.`,
        shouldTransfer: false,
        completed: true,
        metadata: {
          decision: 'rejected',
          rejectionReason: 'High obligation ratio',
          obligationRatio: obligationRatio.toFixed(1),
        },
      };
    }

    // INSTANT APPROVAL: Credit Score >= 750 AND Obligation Ratio <= 45%
    if (creditScore >= 750 && obligationRatio <= 45) {
      application.decision = 'approved';
      application.currentStage = 'sanctioned';
      application.sanctionedAmount = requestedAmount;
      application.interestRate = interestRate;
      application.emi = emi;
      
      return {
        message: `🎉 Congratulations! Your Loan is APPROVED!\\n\\n✅ Approval Details:\\n• Sanctioned Amount: ₹${requestedAmount.toLocaleString('en-IN')}\\n• Interest Rate: ${interestRate}% per annum\\n• Tenure: ${tenure} months\\n• Monthly EMI: ₹${emi.toLocaleString('en-IN')}\\n• Total Payable: ₹${(emi * tenure).toLocaleString('en-IN')}\\n\\n📋 Underwriting Summary:\\n• Credit Score: ${creditScore} ⭐ (Excellent)\\n• Monthly Income: ₹${monthlyIncome.toLocaleString('en-IN')}\\n• Obligation Ratio: ${obligationRatio.toFixed(1)}% ✓\\n\\nYour sanction letter is being generated...`,
        shouldTransfer: true,
        nextAgent: 'sanction',
        metadata: {
          decision: 'approved',
          sanctionedAmount: requestedAmount,
          interestRate,
          emi,
          tenure,
          creditScore,
          obligationRatio: obligationRatio.toFixed(1),
        },
      };
    }

    // CONDITIONAL APPROVAL: Credit Score 650-749 OR Obligation Ratio 45-60%
    const conditions: string[] = [];
    let reducedAmount = requestedAmount;
    
    if (creditScore >= 650 && creditScore < 700) {
      conditions.push('Submit additional income proof (last 6 months bank statements)');
      conditions.push('Provide a co-applicant or guarantor');
    } else if (creditScore >= 700 && creditScore < 750) {
      conditions.push('Submit last 3 months salary slips');
    }
    
    if (obligationRatio > 45 && obligationRatio <= 50) {
      conditions.push('Maintain minimum balance of ₹50,000 in savings account');
    } else if (obligationRatio > 50 && obligationRatio <= 60) {
      // Reduce loan amount to bring obligation ratio under 50%
      const maxEMI = (monthlyIncome * 0.50) - existingLiability;
      const maxLoanAmount = this.calculatePrincipalFromEMI(maxEMI, interestRate, tenure);
      reducedAmount = Math.floor(maxLoanAmount / 10000) * 10000; // Round down to nearest 10k
      
      conditions.push(`Loan amount reduced to ₹${reducedAmount.toLocaleString('en-IN')} to maintain healthy obligation ratio`);
      conditions.push('Close at least one existing loan before disbursement');
    }
    
    application.decision = 'conditional';
    application.currentStage = 'sanctioned';
    application.sanctionedAmount = reducedAmount;
    application.interestRate = interestRate;
    application.emi = calculateEMI(reducedAmount, interestRate, tenure);
    application.conditions = conditions;
    
    return {
      message: `✅ Loan Application CONDITIONALLY APPROVED\\n\\n📋 Approval Details:\\n• Sanctioned Amount: ₹${reducedAmount.toLocaleString('en-IN')}${reducedAmount < requestedAmount ? ` (Reduced from ₹${requestedAmount.toLocaleString('en-IN')})` : ''}\\n• Interest Rate: ${interestRate}% per annum\\n• Tenure: ${tenure} months\\n• Monthly EMI: ₹${application.emi.toLocaleString('en-IN')}\\n\\n📊 Underwriting Summary:\\n• Credit Score: ${creditScore}\\n• Monthly Income: ₹${monthlyIncome.toLocaleString('en-IN')}\\n• Obligation Ratio: ${obligationRatio.toFixed(1)}%\\n\\n⚠️ Conditions to be met:\\n${conditions.map((c, i) => `${i + 1}. ${c}`).join('\\n')}\\n\\nYour conditional sanction letter is being generated...`,
      shouldTransfer: true,
      nextAgent: 'sanction',
      metadata: {
        decision: 'conditional',
        sanctionedAmount: reducedAmount,
        interestRate,
        emi: application.emi,
        tenure,
        conditions,
        creditScore,
        obligationRatio: obligationRatio.toFixed(1),
      },
    };
  }
  
  private calculatePrincipalFromEMI(emi: number, ratePerAnnum: number, tenureMonths: number): number {
    const monthlyRate = ratePerAnnum / (12 * 100);
    const principal = (emi * (Math.pow(1 + monthlyRate, tenureMonths) - 1)) / 
                     (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));
    return Math.round(principal);
  }
}
