import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { NotesService } from '@shared/services/notes.service';
import { Note } from '@shared/models/note.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent {

  constructor(private notesService: NotesService, private activatedroute: ActivatedRoute) {}

  // notes$: Observable<Note[]> = this.notesService.getProjectNotes('6638d500d702ab3e83af0dab');
  notes$: Observable<Note[]> = this.notesService.getNotes();

}
