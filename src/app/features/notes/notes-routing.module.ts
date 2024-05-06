import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotesComponent } from './notes.component';
import { NoteCreateComponent } from './note-create/note-create.component';
import { NoteComponent } from './note/note.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: NotesComponent },
  { path: 'create', component: NoteCreateComponent },
  { path: ':id', component: NoteComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
