import { api } from './api';
import { ApiEnvelope } from '../types/api';
import { LoginResponse } from '../types/auth';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post<ApiEnvelope<LoginResponse>>('/auth/login', { email, password });
  return res.data.data;
}
