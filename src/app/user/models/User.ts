export interface User {
  _id?: string;
  username: string,
  email: string,
  firstname: string,
  lastname: string,
  password?: string,
  is_disabled?: boolean,
  role?: number
}