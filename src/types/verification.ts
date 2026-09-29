export type VerificationStatus = 'GENUINE' | 'SUSPICIOUS' | 'INVALID' | 'DEACTIVATED' | 'EXPIRED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface PublicProductView {
  name: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  manufactureDate: string | null;
  expiryDate: string | null;
}

export interface VerificationResponse {
  status: VerificationStatus;
  message: string;
  detail: string;
  riskLevel?: RiskLevel;
  verificationCount?: number;
  product?: PublicProductView;
}
