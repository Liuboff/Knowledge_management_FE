export interface Note {
  id?: string;
  authorId?: string;
  title: string;
  content?: string;
  image?: string;
  category?: string;
  project?: string;
  dateCreated?: string;
  comments?: Comment[];
}
