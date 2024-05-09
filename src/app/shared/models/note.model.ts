export interface Note {
  id?: string;
  authorId?: string;
  title: string;
  content?: string;
  image?: string;
  tags?: string[];
  categories?: string[];
  dateCreated?: string;
  comments?: Comment[];
}
