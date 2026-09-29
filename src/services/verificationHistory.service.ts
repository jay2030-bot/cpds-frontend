import { api } from './api';
import { ApiEnvelope, PaginationMeta } from '../types/api';
import { RecentLogEntry } from '../types/dashboard';

export interface HistoryFilters {
  page?: number;
  limit?: number;
  result?: string;
  riskLevel?: string;
  productId?: string;
  from?: string;
  to?: string;
}

export async function listVerificationHistory(filters: HistoryFilters, suspiciousOnly: boolean) {
  const path = suspiciousOnly ? '/verifications/suspicious' : '/verifications';
  const res = await api.get<ApiEnvelope<RecentLogEntry[]>>(path, { params: filters });
  return { items: res.data.data, meta: res.data.meta as PaginationMeta };
}
