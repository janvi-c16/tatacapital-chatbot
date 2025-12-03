import { CustomerProfile } from './types';

// 10 Test customer profiles covering all scenarios
export const mockCustomerProfiles: Record<string, CustomerProfile> = {
  // Instant Approval Scenarios (2 customers)
  '9876543210': {
    customerId: 'CUST001',
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@email.com',
    creditScore: 780,
    monthlyIncome: 85000,
    existingLiability: 15000,
    employmentType: 'Salaried',
    employmentYears: 5,
    cibilScore: 780,
    existingLoans: 1,
    defaultHistory: false,
  },
  '9876543211': {
    customerId: 'CUST002',
    name: 'Priya Mehta',
    phone: '9876543211',
    email: 'priya.mehta@email.com',
    creditScore: 810,
    monthlyIncome: 120000,
    existingLiability: 20000,
    employmentType: 'Salaried',
    employmentYears: 8,
    cibilScore: 810,
    existingLoans: 0,
    defaultHistory: false,
  },
  
  // Conditional Approval Scenarios (3 customers)
  '9876543212': {
    customerId: 'CUST003',
    name: 'Amit Kumar',
    phone: '9876543212',
    email: 'amit.kumar@email.com',
    creditScore: 720,
    monthlyIncome: 65000,
    existingLiability: 25000,
    employmentType: 'Salaried',
    employmentYears: 3,
    cibilScore: 720,
    existingLoans: 2,
    defaultHistory: false,
  },
  '9876543213': {
    customerId: 'CUST004',
    name: 'Sneha Patel',
    phone: '9876543213',
    email: 'sneha.patel@email.com',
    creditScore: 690,
    monthlyIncome: 55000,
    existingLiability: 18000,
    employmentType: 'Self-Employed',
    employmentYears: 4,
    cibilScore: 690,
    existingLoans: 1,
    defaultHistory: false,
  },
  '9876543214': {
    customerId: 'CUST005',
    name: 'Vikram Singh',
    phone: '9876543214',
    email: 'vikram.singh@email.com',
    creditScore: 710,
    monthlyIncome: 70000,
    existingLiability: 30000,
    employmentType: 'Salaried',
    employmentYears: 6,
    cibilScore: 710,
    existingLoans: 2,
    defaultHistory: false,
  },

  // Low Credit Score Rejection (2 customers)
  '9876543215': {
    customerId: 'CUST006',
    name: 'Manish Gupta',
    phone: '9876543215',
    email: 'manish.gupta@email.com',
    creditScore: 580,
    monthlyIncome: 45000,
    existingLiability: 20000,
    employmentType: 'Salaried',
    employmentYears: 2,
    cibilScore: 580,
    existingLoans: 3,
    defaultHistory: true,
  },
  '9876543216': {
    customerId: 'CUST007',
    name: 'Anjali Reddy',
    phone: '9876543216',
    email: 'anjali.reddy@email.com',
    creditScore: 610,
    monthlyIncome: 40000,
    existingLiability: 25000,
    employmentType: 'Self-Employed',
    employmentYears: 1,
    cibilScore: 610,
    existingLoans: 2,
    defaultHistory: true,
  },

  // Exceeds Limit Rejection (3 customers)
  '9876543217': {
    customerId: 'CUST008',
    name: 'Deepak Joshi',
    phone: '9876543217',
    email: 'deepak.joshi@email.com',
    creditScore: 750,
    monthlyIncome: 50000,
    existingLiability: 35000,
    employmentType: 'Salaried',
    employmentYears: 4,
    cibilScore: 750,
    existingLoans: 3,
    defaultHistory: false,
  },
  '9876543218': {
    customerId: 'CUST009',
    name: 'Pooja Iyer',
    phone: '9876543218',
    email: 'pooja.iyer@email.com',
    creditScore: 730,
    monthlyIncome: 60000,
    existingLiability: 40000,
    employmentType: 'Salaried',
    employmentYears: 3,
    cibilScore: 730,
    existingLoans: 2,
    defaultHistory: false,
  },
  '9876543219': {
    customerId: 'CUST010',
    name: 'Rajesh Nair',
    phone: '9876543219',
    email: 'rajesh.nair@email.com',
    creditScore: 740,
    monthlyIncome: 55000,
    existingLiability: 38000,
    employmentType: 'Self-Employed',
    employmentYears: 5,
    cibilScore: 740,
    existingLoans: 3,
    defaultHistory: false,
  },
};

export const getCustomerProfile = (phone: string): CustomerProfile | null => {
  return mockCustomerProfiles[phone] || null;
};

export const calculateEMI = (principal: number, ratePerAnnum: number, tenureMonths: number): number => {
  const monthlyRate = ratePerAnnum / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
               (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
};

export const getInterestRate = (creditScore: number, employmentType: string): number => {
  let baseRate = 10.5;
  
  if (creditScore >= 750) baseRate = 9.5;
  else if (creditScore >= 700) baseRate = 10.5;
  else if (creditScore >= 650) baseRate = 12.5;
  else baseRate = 14.5;
  
  if (employmentType === 'Self-Employed') baseRate += 0.5;
  
  return baseRate;
};
