export interface Manufacturer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { products: number; users: number };
}

export interface CreateManufacturerInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber?: string;
  adminUser?: { name: string; email: string; password: string };
}
