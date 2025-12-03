import { BaseAgent } from './base-agent';
import { AgentResponse, LoanApplication } from '../types';

export class MasterAgent extends BaseAgent {
  constructor() {
    super('MasterAgent');
  }

  async process(
    message: string,
    application: LoanApplication,
    conversationHistory: any[]
  ): Promise<AgentResponse> {
    this.log(`Processing message: ${message}`);
    
    // Initial greeting
    if (conversationHistory.length === 0 || application.currentStage === 'initial') {
      return {
        message: `Hello! Welcome to Tata Capital Personal Loan Assistant. 🏦\n\nI'm here to help you with your personal loan application. We offer loans from ₹50,000 to ₹25,00,000 with competitive interest rates.\n\nTo get started, may I have your registered mobile number?`,
        shouldTransfer: true,
        nextAgent: 'sales',
      };
    }
    
    // Route to appropriate agent based on stage
    switch (application.currentStage) {
      case 'initial':
        return {
          message: 'Connecting you with our sales team...',
          shouldTransfer: true,
          nextAgent: 'sales',
        };
      case 'verification':
        return {
          message: 'Processing your verification...',
          shouldTransfer: true,
          nextAgent: 'verification',
        };
      case 'underwriting':
        return {
          message: 'Evaluating your loan application...',
          shouldTransfer: true,
          nextAgent: 'underwriting',
        };
      case 'sanctioned':
        return {
          message: 'Generating your sanction letter...',
          shouldTransfer: true,
          nextAgent: 'sanction',
        };
      default:
        return {
          message: 'How can I assist you today?',
          shouldTransfer: false,
        };
    }
  }
}
