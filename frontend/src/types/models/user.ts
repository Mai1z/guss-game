import { UserRole } from '../enums';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}