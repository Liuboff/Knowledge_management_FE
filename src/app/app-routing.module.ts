import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@shared/services/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'notes', loadChildren: () => import('./features/notes/notes.module').then(m => m.NotesModule), canActivate: [authGuard] },
  { path: 'projects', loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule), canActivate: [authGuard] },
  { path: 'jira', loadChildren: () => import('./features/jira/jira.module').then(m => m.JiraModule), canActivate: [authGuard] },
  { path: 'people', loadChildren: () => import('./features/people/people.module').then(m => m.PeopleModule), canActivate: [authGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
