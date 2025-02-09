export interface LocationPayload {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  status: 'active' | 'inactive';
}
