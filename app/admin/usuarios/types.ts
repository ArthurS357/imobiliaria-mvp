export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  creci?: string | null;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: string;
  creci: string;
}
