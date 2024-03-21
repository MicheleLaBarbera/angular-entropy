export interface ClassroomHomeworkMap {
  _id?: {
    $oid: string
  }
  homework_id: string,
  nodes_count: number,
  edges_count: number,
  nodes_labels: string[]
  adjacency_matrix: number[][]
  adjacency_matrix_labels: string[][],
  created_at?: number,
  entropy?: number,
  entropy_percent?: number,
  effort?: number,
  color_entropy?: number,
  color_entropy_percent?: number,
  color_effort?: number,
  is_teacher_map?: boolean,
  author_name?: string
}