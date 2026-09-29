import { api } from './api';
import { ApiEnvelope, PaginationMeta } from '../types/api';
import { CreateProductInput, Product, ProductStatus } from '../types/product';

export interface ListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductStatus;
  manufacturerId?: string;
}

export async function listProducts(params: ListProductsParams = {}) {
  const res = await api.get<ApiEnvelope<Product[]>>('/products', { params });
  return { items: res.data.data, meta: res.data.meta as PaginationMeta };
}

export async function getProduct(id: string): Promise<Product> {
  const res = await api.get<ApiEnvelope<Product>>(`/products/${id}`);
  return res.data.data;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const res = await api.post<ApiEnvelope<Product>>('/products', input);
  return res.data.data;
}

export async function updateProductStatus(id: string, status: ProductStatus): Promise<Product> {
  const res = await api.patch<ApiEnvelope<Product>>(`/products/${id}`, { status });
  return res.data.data;
}
