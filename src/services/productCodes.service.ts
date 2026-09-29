import { api } from './api';
import { ApiEnvelope, PaginationMeta } from '../types/api';
import { ProductVerificationCode } from '../types/productCode';

export async function listCodesForProduct(productId: string, params: { page?: number; limit?: number } = {}) {
  const res = await api.get<ApiEnvelope<ProductVerificationCode[]>>(`/products/${productId}/verification-codes`, { params });
  return { items: res.data.data, meta: res.data.meta as PaginationMeta };
}

export async function generateCode(productId: string): Promise<ProductVerificationCode> {
  const res = await api.post<ApiEnvelope<ProductVerificationCode>>(`/products/${productId}/verification-code`);
  return res.data.data;
}

export async function bulkGenerateCodes(productId: string, quantity: number) {
  const res = await api.post<ApiEnvelope<{ requested: number; created: number }>>(
    `/products/${productId}/verification-codes/bulk`,
    { quantity },
  );
  return res.data.data;
}

export async function setCodeStatus(id: string, status: 'ACTIVE' | 'DEACTIVATED'): Promise<ProductVerificationCode> {
  const res = await api.patch<ApiEnvelope<ProductVerificationCode>>(`/verification-codes/${id}/status`, { status });
  return res.data.data;
}

/**
 * QR downloads require the Authorization header, so a plain <a href> won't work
 * (the browser's navigation request carries no auth token). Instead, fetch the
 * image as a blob through the authenticated axios instance, then trigger a
 * client-side download from an object URL.
 */
export async function downloadQrCode(id: string, format: 'png' | 'svg', filename: string) {
  const res = await api.get(`/verification-codes/${id}/qrcode.${format}`, { responseType: 'blob' });
  const url = URL.createObjectURL(res.data as Blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
