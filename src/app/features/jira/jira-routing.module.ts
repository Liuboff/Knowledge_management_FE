import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JiraComponent } from './jira.component';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  { path: '', component: JiraComponent },
  { path: ':id', component: TaskComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JiraRoutingModule { }
