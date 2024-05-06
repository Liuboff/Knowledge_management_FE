import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { NotesService } from '@shared/services/notes.service';
import { Note } from '@shared/models/note.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent implements OnInit {
  constructor(private notesService: NotesService, private route: ActivatedRoute) {}

  note$!: Observable<Note>;

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.note$ = this.notesService.getNoteById(id);
    }
  }
}
