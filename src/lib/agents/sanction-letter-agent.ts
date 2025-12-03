import { BaseAgent } from './base-agent';
import { AgentResponse, LoanApplication } from '../types';

export class SanctionLetterAgent extends BaseAgent {
  constructor() {
    super('SanctionLetterAgent');
  }

  async process(
    message: string,
    application: LoanApplication,
    conversationHistory: any[]
  ): Promise<AgentResponse> {
    this.log(`Generating sanction letter for ${application.customerId}`);
    
    if (application.decision === 'rejected') {
      return {
        message: 'Sanction letter cannot be generated for rejected applications.',
        shouldTransfer: false,
        completed: true,
      };
    }

    const isConditional = application.decision === 'conditional';
    const sanctionDate = new Date().toLocaleDateString('en-IN');
    const validityDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');

    let letterContent = `📄 LOAN SANCTION LETTER\\n\\n`;
    letterContent += `Reference No: TC/PL/${application.customerId}/${Date.now()}\\n`;
    letterContent += `Date: ${sanctionDate}\\n\\n`;
    letterContent += `Dear ${application.name},\\n\\n`;
    
    if (isConditional) {
      letterContent += `We are pleased to inform you that your personal loan application has been CONDITIONALLY APPROVED subject to fulfillment of certain conditions.\\n\\n`;
    } else {
      letterContent += `Congratulations! We are pleased to inform you that your personal loan application has been APPROVED.\\n\\n`;
    }
    
    letterContent += `🏦 LOAN DETAILS:\\n`;
    letterContent += `• Loan Amount Sanctioned: ₹${application.sanctionedAmount?.toLocaleString('en-IN')}\\n`;
    letterContent += `• Interest Rate: ${application.interestRate}% per annum\\n`;
    letterContent += `• Tenure: ${application.tenure} months\\n`;
    letterContent += `• Monthly EMI: ₹${application.emi?.toLocaleString('en-IN')}\\n`;
    letterContent += `• Total Amount Payable: ₹${((application.emi || 0) * application.tenure).toLocaleString('en-IN')}\\n`;
    letterContent += `• Processing Fee: ₹${Math.round((application.sanctionedAmount || 0) * 0.02).toLocaleString('en-IN')} (2% of loan amount)\\n\\n`;
    
    if (isConditional && application.conditions && application.conditions.length > 0) {
      letterContent += `⚠️ CONDITIONS:\\n`;
      application.conditions.forEach((condition, index) => {
        letterContent += `${index + 1}. ${condition}\\n`;
      });
      letterContent += `\\n`;
    }
    
    letterContent += `📋 NEXT STEPS:\\n`;
    letterContent += `1. Review and accept the terms and conditions\\n`;
    if (isConditional) {
      letterContent += `2. Submit required documents to fulfill conditions\\n`;
      letterContent += `3. Complete KYC verification\\n`;
      letterContent += `4. Pay processing fee\\n`;
      letterContent += `5. Loan disbursement within 3-5 business days after condition fulfillment\\n\\n`;
    } else {
      letterContent += `2. Complete KYC verification\\n`;
      letterContent += `3. Pay processing fee\\n`;
      letterContent += `4. Loan disbursement within 24-48 hours\\n\\n`;
    }
    
    letterContent += `📅 VALIDITY:\\n`;
    letterContent += `This sanction letter is valid until ${validityDate}\\n\\n`;
    
    letterContent += `✅ Would you like to:\\n`;
    letterContent += `• Download PDF Sanction Letter\\n`;
    letterContent += `• Calculate different EMI scenarios\\n`;
    letterContent += `• Proceed with acceptance\\n\\n`;
    
    letterContent += `Thank you for choosing Tata Capital!\\n\\n`;
    letterContent += `For any queries, contact us at:\\n`;
    letterContent += `📞 1800-209-8800\\n`;
    letterContent += `📧 support@tatacapital.com\\n`;

    return {
      message: letterContent,
      shouldTransfer: false,
      completed: true,
      metadata: {
        sanctionLetterId: `TC/PL/${application.customerId}/${Date.now()}`,
        sanctionDate,
        validityDate,
        canDownloadPDF: true,
      },
    };
  }
}
