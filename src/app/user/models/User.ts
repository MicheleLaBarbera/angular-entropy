export interface User {
  username: string,
  email: string,
  firstname: string,
  lastname: string,
  password?: string,
  is_disabled?: boolean,
  role?: number
}