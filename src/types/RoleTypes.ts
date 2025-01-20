export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Role {

  id: number;

  name: string;

  guard_name: string;

  created_at: string;

  updated_at: string;

  permissions: Permission[];

  users: User[];

}


export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

