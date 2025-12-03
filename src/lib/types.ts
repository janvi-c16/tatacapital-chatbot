// Type definitions for the loan chatbot system

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentType?: 'master' | 'sales' | 'verification' | 'underwriting' | 'sanction';
  metadata?: {
    loanAmount?: number;
    tenure?: number;
    emi?: number;
    interestRate?: number;
    decision?: 'approved' | 'conditional' | 'rejected';
    rejectionReason?: string;
    conditions?: string[];
  };
}

export interface LoanApplication {
  customerId: string;
  name: string;
  phone: string;
  email: string;
  requestedAmount: number;
  tenure: number;
  purpose: string;
  employmentType: string;
  monthlyIncome?: number;
  currentStage: 'initial' | 'verification' | 'underwriting' | 'sanctioned' | 'rejected';
  creditScore?: number;
  existingLiability?: number;
  salarySlipUploaded?: boolean;
  decision?: 'approved' | 'conditional' | 'rejected';
  sanctionedAmount?: number;
  interestRate?: number;
  emi?: number;
  conditions?: string[];
  rejectionReason?: string;
}

export interface CustomerProfile {
  customerId: string;
  name: string;
  phone: string;
  email: string;
  creditScore: number;
  monthlyIncome: number;
  existingLiability: number;
  employmentType: string;
  employmentYears: number;
  cibilScore: number;
  existingLoans: number;
  defaultHistory: boolean;
}

export interface AgentResponse {
  message: string;
  shouldTransfer: boolean;
  nextAgent?: string;
  metadata?: any;
  completed?: boolean;
}
