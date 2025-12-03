import { MasterAgent } from './master-agent';
import { SalesAgent } from './sales-agent';
import { VerificationAgent } from './verification-agent';
import { UnderwritingAgent } from './underwriting-agent';
import { SanctionLetterAgent } from './sanction-letter-agent';
import { LoanApplication, Message, AgentResponse } from '../types';

export class AgentOrchestrator {
  private masterAgent: MasterAgent;
  private salesAgent: SalesAgent;
  private verificationAgent: VerificationAgent;
  private underwritingAgent: UnderwritingAgent;
  private sanctionLetterAgent: SanctionLetterAgent;
  
  private currentAgent: string = 'master';

  constructor() {
    this.masterAgent = new MasterAgent();
    this.salesAgent = new SalesAgent();
    this.verificationAgent = new VerificationAgent();
    this.underwritingAgent = new UnderwritingAgent();
    this.sanctionLetterAgent = new SanctionLetterAgent();
  }

  async processMessage(
    message: string,
    application: LoanApplication,
    conversationHistory: Message[]
  ): Promise<{
    response: string;
    application: LoanApplication;
    metadata?: any;
    agentType: string;
  }> {
    console.log(`[Orchestrator] Current Agent: ${this.currentAgent}, Stage: ${application.currentStage}`);
    
    let agentResponse: AgentResponse;
    let agentType = this.currentAgent;

    // Route to appropriate agent
    switch (this.currentAgent) {
      case 'master':
        agentResponse = await this.masterAgent.process(message, application, conversationHistory);
        break;
      case 'sales':
        agentResponse = await this.salesAgent.process(message, application, conversationHistory);
        if (agentResponse.shouldTransfer && agentResponse.nextAgent === 'verification') {
          application.currentStage = 'verification';
        }
        break;
      case 'verification':
        agentResponse = await this.verificationAgent.process(message, application, conversationHistory);
        if (agentResponse.shouldTransfer && agentResponse.nextAgent === 'underwriting') {
          application.currentStage = 'underwriting';
        }
        break;
      case 'underwriting':
        agentResponse = await this.underwritingAgent.process(message, application, conversationHistory);
        if (agentResponse.shouldTransfer && agentResponse.nextAgent === 'sanction') {
          application.currentStage = 'sanctioned';
        }
        break;
      case 'sanction':
        agentResponse = await this.sanctionLetterAgent.process(message, application, conversationHistory);
        break;
      default:
        agentResponse = await this.masterAgent.process(message, application, conversationHistory);
    }

    // Handle agent transfer
    if (agentResponse.shouldTransfer && agentResponse.nextAgent) {
      this.currentAgent = agentResponse.nextAgent;
      console.log(`[Orchestrator] Transferring to agent: ${this.currentAgent}`);
      
      // If transfer requires immediate next agent processing
      if (this.currentAgent !== 'sales') {
        const nextResponse = await this.processMessage('', application, conversationHistory);
        return nextResponse;
      }
    }

    // Update application with metadata
    if (agentResponse.metadata) {
      Object.assign(application, agentResponse.metadata);
    }

    return {
      response: agentResponse.message,
      application,
      metadata: agentResponse.metadata,
      agentType,
    };
  }

  getCurrentAgent(): string {
    return this.currentAgent;
  }

  resetAgent(): void {
    this.currentAgent = 'master';
  }
}
