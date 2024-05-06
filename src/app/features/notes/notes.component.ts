import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { NotesService } from '@shared/services/notes.service';
import { Note } from '@shared/models/note.model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent {

  constructor(private notesService: NotesService) {}

  notes$: Observable<Note[]> = this.notesService.getNotes();

}
