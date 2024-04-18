import { ClassroomHomeworkMap } from "./ClassroomHomeworkMap";

export interface ClassroomHomework {
  _id?: {
    $oid: string
  }
  classroom_id: string;
  title: string;
  body: string;
  node_min: number;
  node_max: number;
  start_datetime: number;
  expire_datetime: number;
  student_map?: ClassroomHomeworkMap | null;
  maps?: ClassroomHomeworkMap[]
  status?: number;
  created_at?: number;
}

export enum CLASSROOM_HOMEWORK_ACTION { CREATE, UPDATE, DELETE };