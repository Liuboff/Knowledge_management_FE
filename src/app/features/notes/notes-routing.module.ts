import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotesComponent } from './notes.component';
import { NoteComponent } from './note/note.component';
import { NoteCreateComponent } from './note-create/note-create.component';
import { NoteUpdateComponent } from './note-update/note-update.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: NotesComponent },
  { path: ':id', component: NoteComponent },
  { path: 'create', component: NoteCreateComponent },
  { path: 'update/:id', component: NoteUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
