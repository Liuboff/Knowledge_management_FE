import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, Observable } from 'rxjs';

import { Task } from '@shared/models/task.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth.service';
import { ProjectsService } from '@shared/services/projects.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  constructor(private route: ActivatedRoute, private projectService: ProjectsService, private auth: AuthService) {}

  taskId: string = '';
  task!: Task;
  assignee$!: Observable<User>;
  status: string[]= ['To Do','In Progress','Done'];

  ngOnInit() {
    this.route.paramMap
      .pipe(map((params: ParamMap) => params.get('id')!)).subscribe((id) => {
        this.taskId = id;

        this.projectService.getTaskById(this.taskId).subscribe((task) => {
          this.task = task;
          this.assignee$ = this.auth.getUserInfo(this.task.assigneeId!);
        });
      });
  }
}
