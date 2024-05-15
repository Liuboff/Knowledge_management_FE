import { Component } from '@angular/core';
import { Observable } from 'rxjs';
// import { filter } from 'rxjs/operators';

import { NotesService } from '@shared/services/notes.service';
import { Note } from '@shared/models/note.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent {

  constructor(private notesService: NotesService, private route: ActivatedRoute) {}

  prId!: string;
  notes$!: Observable<Note[]>;

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.prId = params['projectId'];
        this.notes$ = this.notesService.getProjectNotes(this.prId);
      }
    );
  }

}
