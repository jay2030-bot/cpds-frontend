import { api } from './api';
import { ApiEnvelope, PaginationMeta } from '../types/api';
import { CreateManufacturerInput, Manufacturer } from '../types/manufacturer';

export async function listManufacturers(params: { page?: number; limit?: number; search?: string } = {}) {
  const res = await api.get<ApiEnvelope<Manufacturer[]>>('/manufacturers', { params });
  return { items: res.data.data, meta: res.data.meta as PaginationMeta };
}

export async function getManufacturer(id: string): Promise<Manufacturer> {
  const res = await api.get<ApiEnvelope<Manufacturer>>(`/manufacturers/${id}`);
  return res.data.data;
}

export async function createManufacturer(input: CreateManufacturerInput): Promise<Manufacturer> {
  const res = await api.post<ApiEnvelope<Manufacturer>>('/manufacturers', input);
  return res.data.data;
}

export async function setManufacturerActive(id: string, isActive: boolean): Promise<Manufacturer> {
  const res = await api.patch<ApiEnvelope<Manufacturer>>(`/manufacturers/${id}`, { isActive });
  return res.data.data;
}
