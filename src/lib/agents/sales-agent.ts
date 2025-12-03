import { BaseAgent } from './base-agent';
import { AgentResponse, LoanApplication } from '../types';

export class SalesAgent extends BaseAgent {
  private collectedData: any = {};
  
  constructor() {
    super('SalesAgent');
  }

  async process(
    message: string,
    application: LoanApplication,
    conversationHistory: any[]
  ): Promise<AgentResponse> {
    this.log(`Processing sales interaction: ${message}`);
    
    // Check if we need phone number
    if (!application.phone || application.phone === '') {
      // Extract phone number from message
      const phoneMatch = message.match(/\b\d{10}\b/);
      if (phoneMatch) {
        application.phone = phoneMatch[0];
        return {
          message: `Thank you! I've recorded your mobile number: ${application.phone}\n\nWhat is your full name?`,
          shouldTransfer: false,
          metadata: { phone: application.phone },
        };
      } else {
        return {
          message: 'Please provide a valid 10-digit mobile number.',
          shouldTransfer: false,
        };
      }
    }
    
    // Check if we need name
    if (!application.name || application.name === '') {
      application.name = message.trim();
      return {
        message: `Nice to meet you, ${application.name}! 👋\n\nWhat is your email address?`,
        shouldTransfer: false,
        metadata: { name: application.name },
      };
    }
    
    // Check if we need email
    if (!application.email || application.email === '') {
      const emailMatch = message.match(/\b[\w.-]+@[\w.-]+\.\w+\b/);
      if (emailMatch) {
        application.email = emailMatch[0];
        return {
          message: `Great! Email recorded: ${application.email}\n\nHow much loan amount are you looking for? (₹50,000 - ₹25,00,000)`,
          shouldTransfer: false,
          metadata: { email: application.email },
        };
      } else {
        return {
          message: 'Please provide a valid email address.',
          shouldTransfer: false,
        };
      }
    }
    
    // Check if we need loan amount
    if (!application.requestedAmount || application.requestedAmount === 0) {
      const amountMatch = message.match(/\d+/);
      if (amountMatch) {
        const amount = parseInt(amountMatch[0]);
        if (amount >= 50000 && amount <= 2500000) {
          application.requestedAmount = amount;
          return {
            message: `Loan amount: ₹${amount.toLocaleString('en-IN')}\n\nFor what tenure (in months) would you like this loan? (12-60 months)`,
            shouldTransfer: false,
            metadata: { requestedAmount: amount },
          };
        } else {
          return {
            message: 'Loan amount should be between ₹50,000 and ₹25,00,000. Please enter a valid amount.',
            shouldTransfer: false,
          };
        }
      } else {
        return {
          message: 'Please enter the loan amount in numbers (e.g., 500000 for ₹5 lakh).',
          shouldTransfer: false,
        };
      }
    }
    
    // Check if we need tenure
    if (!application.tenure || application.tenure === 0) {
      const tenureMatch = message.match(/\d+/);
      if (tenureMatch) {
        const tenure = parseInt(tenureMatch[0]);
        if (tenure >= 12 && tenure <= 60) {
          application.tenure = tenure;
          return {
            message: `Tenure: ${tenure} months\n\nWhat is the purpose of this loan? (e.g., Home Renovation, Medical Emergency, Education, Wedding, Business, Debt Consolidation)`,
            shouldTransfer: false,
            metadata: { tenure: tenure },
          };
        } else {
          return {
            message: 'Tenure should be between 12 and 60 months. Please enter a valid tenure.',
            shouldTransfer: false,
          };
        }
      } else {
        return {
          message: 'Please enter the tenure in months (e.g., 24 for 2 years).',
          shouldTransfer: false,
        };
      }
    }
    
    // Check if we need purpose
    if (!application.purpose || application.purpose === '') {
      application.purpose = message.trim();
      return {
        message: `Purpose: ${application.purpose}\n\nAre you Salaried or Self-Employed?`,
        shouldTransfer: false,
        metadata: { purpose: application.purpose },
      };
    }
    
    // Check if we need employment type
    if (!application.employmentType || application.employmentType === '') {
      const employment = message.toLowerCase();
      if (employment.includes('salaried') || employment.includes('salary')) {
        application.employmentType = 'Salaried';
      } else if (employment.includes('self') || employment.includes('business')) {
        application.employmentType = 'Self-Employed';
      } else {
        return {
          message: 'Please specify if you are "Salaried" or "Self-Employed".',
          shouldTransfer: false,
        };
      }
      
      return {
        message: `Employment Type: ${application.employmentType}\n\n✅ Thank you for providing all the details!\n\n📋 Application Summary:\n• Name: ${application.name}\n• Mobile: ${application.phone}\n• Email: ${application.email}\n• Loan Amount: ₹${application.requestedAmount.toLocaleString('en-IN')}\n• Tenure: ${application.tenure} months\n• Purpose: ${application.purpose}\n• Employment: ${application.employmentType}\n\nI'm now transferring you to our verification team to check your eligibility...`,
        shouldTransfer: true,
        nextAgent: 'verification',
        metadata: { employmentType: application.employmentType },
      };
    }
    
    return {
      message: 'I need more information to proceed. Please answer the current question.',
      shouldTransfer: false,
    };
  }
}
