export interface ILoanFilters {
  searchTerm?: string;
  loanType?: 'CASH_WITH_PRODUCT' | 'CASH_ONLY';
  status?: 'PENDING' | 'ACTIVE' | 'FINISHED' | 'DUE';
  fromDate?: string;
  toDate?: string;
  dueFrom?: string;
  dueTo?: string;
  minAmount?: string;
  maxAmount?: string;
}

export interface ICreateLoanPayload {
  title: string;
  amount: number;
  loanType: 'CASH_WITH_PRODUCT' | 'CASH_ONLY';
  dueDate?: string | null;
}

export interface IUpdateLoanPayload {
  title?: string;
  amount?: number;
  remainingAmount?: number;
  loanType?: 'CASH_WITH_PRODUCT' | 'CASH_ONLY';
  status?: 'PENDING' | 'ACTIVE' | 'FINISHED' | 'DUE';
  dueDate?: string | null;
}
