export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  email: string;
  phone?: string;
  token?: string;
  isAdmin?: true;
  city?: string;
  country?: string;
  projects?: any[];
  tasks?: any[];
  role?: string;
}
