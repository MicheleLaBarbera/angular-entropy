import { User } from "src/app/user/models/User";

export interface Classroom {
  _id?: {
    $oid: string
  }
  teacher?: User;
  name: string;
  size: number;
  invite_token?: string;
  students_count?: number;
  homeworks_count?: number;
}

export enum CLASSROOM_ACTION { CREATE, UPDATE, DELETE };