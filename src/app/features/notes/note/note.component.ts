import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { NotesService } from '@shared/services/notes.service';
import { Note } from '@shared/models/note.model';
@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent implements OnInit {
  constructor( private notesService: NotesService, private route: ActivatedRoute ) {}

  note$!: Observable<Note>;

  ngOnInit() {
    this.route.snapshot.paramMap.get('id');

    this.note$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.notesService.getNoteById(params.get('id')!)
      )
    );
  }
}
