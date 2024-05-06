export interface Note {
  id?: string;
  userId?: string;
  title: string;
  content?: string;
  image?: string;
  tags?: string[];
  categories?: string[];
  dateCreated?: string;
}
