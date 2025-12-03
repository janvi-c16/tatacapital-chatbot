import { BaseAgent } from './base-agent';
import { AgentResponse, LoanApplication } from '../types';
import { getCustomerProfile } from '../mock-data';

export class VerificationAgent extends BaseAgent {
  constructor() {
    super('VerificationAgent');
  }

  async process(
    message: string,
    application: LoanApplication,
    conversationHistory: any[]
  ): Promise<AgentResponse> {
    this.log(`Verifying customer: ${application.phone}`);
    
    // Simulate CRM/Credit Bureau lookup
    const customerProfile = getCustomerProfile(application.phone);
    
    if (!customerProfile) {
      return {
        message: `❌ We couldn't find your profile in our system.\n\nAs a new customer, we'll need you to upload your latest salary slip for verification.\n\nPlease use the "Upload Document" button below to submit your salary slip. 📄`,
        shouldTransfer: false,
        metadata: { 
          needsDocumentUpload: true,
          verificationStatus: 'pending_documents'
        },
      };
    }
    
    // Customer found in system
    application.customerId = customerProfile.customerId;
    application.creditScore = customerProfile.creditScore;
    application.monthlyIncome = customerProfile.monthlyIncome;
    application.existingLiability = customerProfile.existingLiability;
    
    this.log(`Customer verified: ${customerProfile.name}, Credit Score: ${customerProfile.creditScore}`);
    
    return {
      message: `✅ Verification Successful!\n\nWe found your profile in our system:\n• Customer ID: ${customerProfile.customerId}\n• Credit Score: ${customerProfile.cibilScore}\n• Monthly Income: ₹${customerProfile.monthlyIncome.toLocaleString('en-IN')}\n• Existing EMI: ₹${customerProfile.existingLiability.toLocaleString('en-IN')}\n\nProceeding to underwriting for loan assessment...`,
      shouldTransfer: true,
      nextAgent: 'underwriting',
      metadata: {
        customerProfile,
        verificationStatus: 'verified'
      },
    };
  }
}
