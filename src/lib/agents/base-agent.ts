import { AgentResponse, LoanApplication } from '../types';

export abstract class BaseAgent {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  abstract process(
    message: string,
    application: LoanApplication,
    conversationHistory: any[]
  ): Promise<AgentResponse>;
  
  protected log(message: string) {
    console.log(`[${this.name}]: ${message}`);
  }
}
