import { api } from './api';
import { ApiEnvelope } from '../types/api';
import { Role } from '../types/auth';
import { DashboardResponse } from '../types/dashboard';

export async function fetchDashboard(role: Role): Promise<DashboardResponse> {
  const path = role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/manufacturer';
  const res = await api.get<ApiEnvelope<DashboardResponse>>(path);
  return res.data.data;
}
