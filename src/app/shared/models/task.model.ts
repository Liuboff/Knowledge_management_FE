export interface Task {
  id?: string;
  title: string;
  content: string;
  taskStatus: string;
  status: string;
  storyPoint: number;
  image?: string;
  assigneeId?: string;
  reporterId?: string;
  dateStart?: string;
  dateEnd?: string;
}
