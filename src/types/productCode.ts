export type CodeStatus = 'ACTIVE' | 'DEACTIVATED' | 'EXPIRED';

export interface ProductVerificationCode {
  id: string;
  productId: string;
  verificationToken: string;
  qrCodeUrl: string | null;
  status: CodeStatus;
  verificationCount: number;
  firstVerifiedAt: string | null;
  lastVerifiedAt: string | null;
  createdAt: string;
}
