import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MasterService } from '@shared/services/master.service';
import { AuthService } from '@shared/services/auth.service';
import { ProjectsService } from '@shared/services/projects.service';
import { Project } from '@shared/models/project.model';
import { User } from '@shared/models/user.model';
import { Task } from '@shared/models/task.model';

@Component({
  selector: 'app-jira',
  templateUrl: './jira.component.html',
  styleUrl: './jira.component.scss'
})
export class JiraComponent implements OnInit {
  currentUserId: string = '';
  currentProject!: Project;
  projectList: Project[] = [];
  taskList: Task[] = [];
  userList: User[] = [];
  issueTypes: string[]= ['Ticket','Defect','RnD Work'];
  status: string[]= ['To Do','In Progress','Done'];
  storyPoint: number[]= [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

  taskObj: any = {
    'title': '',
    'content': '',
    'status': 'To Do',
    'type': 'Ticket',
    'taskStatus': '6638ab9fd702ab3e83af0da8',
    'storyPoint': 1,
    'image': "",
    'assigneeId': '',
    'reporterId': '',
    'projectId': '',
    'dateStart': new Date().toISOString(),
    'dateEnd': '2025-09-12T05:58:41.065Z'
  }

  constructor(private http: HttpClient, private master: MasterService, private auth: AuthService, private projectsServise: ProjectsService) {
    this.auth.getCurrentUser().subscribe((user) => {
      if (user?.id) {
        this.currentUserId = user.id;
        this.taskObj.createdBy = user.id;
      }
    });
  }

  ngOnInit(): void {
    this.getAllProjects();
  }

  setProject(obj: any) {
    this.master.onProjectChange.next(obj);
    this.currentProject = obj;
    this.getAllUsers();
    this.getAllProjectTasks();
  }

  getAllProjects() {
    this.projectsServise.getUserProjects(this.currentUserId).subscribe((projects) => {
      if (projects) {
        this.projectList = projects;
        this.currentProject = this.projectList[0];
        this.master.onProjectChange.next(this.projectList[0]);
        this.getAllUsers();
        this.getAllProjectTasks();
      }
    });
  }

  getAllUsers() {
    this.projectsServise.getProjectTeam(this.currentProject.id!).subscribe((users: any)=>{
      this.userList = users;
    })
  }

  getAllProjectTasks() {
    this.projectsServise.getProjectTasks(this.currentProject.id!).subscribe((tasks: any)=>{
      this.taskList = tasks;
    })
  }

  filterTasks(status: string) {
    return this.taskList.filter(m => m.status == status)
  }

  onTaskCreate() {
    this.projectsServise.createTask(this.taskObj).subscribe((res: Task)=>{
      if(res) {
       alert('Successfully created task.');
       this.getAllProjectTasks();
       this.master.onTicketCreate.next(true);
      } else {
       alert('An error occurred while creating the task.');
      }
   })
  }

}
