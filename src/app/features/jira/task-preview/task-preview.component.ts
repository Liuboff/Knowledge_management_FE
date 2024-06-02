import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Task } from '@shared/models/task.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrl: './task-preview.component.scss'
})
export class TaskPreviewComponent implements OnInit {
  constructor(private auth: AuthService) {}

  @Input() task!: Task;
  assignee$!: Observable<User>;

  ngOnInit() {
    this.assignee$ = this.auth.getUserInfo(this.task.assigneeId!);
  }

}
