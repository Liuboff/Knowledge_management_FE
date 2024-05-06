import { User } from "./user.model";

export interface Project {
  id?: string;
  name: string;
  dateStart?: string;
  dateEnd?: string;
  team?: User[];
  tasks?: any[];
}
