export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'RECALLED';

export interface Product {
  id: string;
  manufacturerId: string;
  manufacturer: { id: string; name: string };
  name: string;
  productCode: string;
  category: string;
  description: string | null;
  batchNumber: string;
  serialNumber: string | null;
  manufactureDate: string | null;
  expiryDate: string | null;
  status: ProductStatus;
  createdAt: string;
  _count?: { verificationCodes: number };
}

export interface CreateProductInput {
  manufacturerId?: string;
  name: string;
  productCode: string;
  category: string;
  description?: string;
  batchNumber: string;
  serialNumber?: string;
  manufactureDate?: string;
  expiryDate?: string;
  status?: ProductStatus;
}
