import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { JiraRoutingModule } from './jira-routing.module';
import { JiraComponent } from './jira.component';
import { TaskPreviewComponent } from './task-preview/task-preview.component';
import { TaskComponent } from './task/task.component';

@NgModule({
  declarations: [
    JiraComponent,
    TaskPreviewComponent,
    TaskComponent
  ],
  imports: [
    CommonModule,
    JiraRoutingModule,
    FormsModule,
    HttpClientModule
  ]
})
export class JiraModule { }
