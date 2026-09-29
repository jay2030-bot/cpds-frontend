import { api } from './api';
import { ApiEnvelope } from '../types/api';
import { VerificationResponse } from '../types/verification';

export async function verifyByToken(token: string): Promise<VerificationResponse> {
  const res = await api.get<ApiEnvelope<VerificationResponse>>(`/verification/${encodeURIComponent(token)}`);
  return res.data.data;
}

export async function verifyManualCode(code: string): Promise<VerificationResponse> {
  const res = await api.post<ApiEnvelope<VerificationResponse>>('/verification/manual', { code });
  return res.data.data;
}
