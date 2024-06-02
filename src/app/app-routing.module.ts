import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'notes', loadChildren: () => import('./features/notes/notes.module').then(m => m.NotesModule) },
  { path: 'projects', loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'jira', loadChildren: () => import('./features/jira/jira.module').then(m => m.JiraModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
