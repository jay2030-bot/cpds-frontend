export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  deactivatedProducts: number;
  totalVerificationCodes: number;
  totalVerifications: number;
  genuineVerifications: number;
  suspiciousVerifications: number;
  invalidAttempts: number;
}

export interface ActivityPoint {
  date: string;
  genuine: number;
  suspicious: number;
  invalid: number;
  deactivated: number;
  expired: number;
}

export interface ResultBreakdown {
  genuine: number;
  suspicious: number;
  invalid: number;
  deactivated: number;
  expired: number;
}

export interface TopVerifiedProduct {
  productId: string;
  name: string;
  productCode: string;
  verificationCount: number;
}

export interface RecentLogEntry {
  id: string;
  result: string;
  riskLevel: string;
  verifiedAt: string;
  enteredCode: string | null;
  verificationCode: {
    verificationToken: string;
    product: { id: string; name: string; productCode: string };
  } | null;
}

export interface DashboardResponse {
  stats: DashboardStats;
  activityOverTime: ActivityPoint[];
  resultBreakdown: ResultBreakdown;
  topVerifiedProducts: TopVerifiedProduct[];
  recentSuspiciousActivity: RecentLogEntry[];
}
