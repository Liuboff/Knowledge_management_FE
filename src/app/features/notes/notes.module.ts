import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EditorModule } from '@tinymce/tinymce-angular';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes.component';
import { NoteComponent } from './note/note.component'
import { NoteCreateComponent } from './note-create/note-create.component';

@NgModule({
  declarations: [
    NotesComponent,
    NoteComponent,
    NoteCreateComponent
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    ReactiveFormsModule,
    EditorModule
  ]
})
export class NotesModule { }
