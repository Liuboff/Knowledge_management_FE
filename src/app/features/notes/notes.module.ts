import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EditorModule } from '@tinymce/tinymce-angular';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes.component';
import { NoteComponent } from './note/note.component'
import { NoteCreateComponent } from './note-create/note-create.component';
import { CommentComponent } from './comment/comment.component';
import { SharedModule } from '@shared/shared.module';
import { NoteUpdateComponent } from './note-update/note-update.component';

@NgModule({
  declarations: [
    NotesComponent,
    NoteComponent,
    NoteCreateComponent,
    CommentComponent,
    NoteUpdateComponent,
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    ReactiveFormsModule,
    EditorModule,
    SharedModule
  ]
})
export class NotesModule { }
