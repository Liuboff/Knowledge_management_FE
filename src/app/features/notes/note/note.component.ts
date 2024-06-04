import { Component, OnInit } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NotesService } from '@shared/services/notes.service';
import { Note } from '@shared/models/note.model';
import { Comment } from '@shared/models/comment.model';
import { AuthService } from '@shared/services/auth.service';
import { User } from '@shared/models/user.model';
@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent implements OnInit {
  constructor(
    private notesService: NotesService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private notesServise: NotesService,
    private auth: AuthService
  ) {}

  noteId: string = '';
  note$!: Observable<Note>;
  note!: Note;
  comments$!: Observable<Comment[]>;
  author!: User;
  isAuthor: boolean = false;
  currentUserId!: string;
  commentCreation: boolean = false;
  commentForm!: FormGroup;
  errorMessage: string = '';

  ngOnInit() {
    this.auth.getCurrentUser().pipe(
      tap((user) => {
        if (user?.id) {
          this.currentUserId = user.id;
        }
      }),
      switchMap(() => this.route.paramMap),
      map((params: ParamMap) => params.get('id')!),
      switchMap((id) => {
        this.noteId = id;
        return this.notesService.getNoteById(this.noteId);
      }),
      tap((note) => {
        this.note = note;
        if (this.currentUserId === this.note.authorId) {
          this.isAuthor = true;
        }
      }),
      switchMap((note) => this.auth.getUserInfo(note?.authorId!))
    ).subscribe((author) => {
      this.author = author;
    });
  }

  deleteNote(noteId: string) {
    this.notesService.deleteNote(noteId).subscribe();
    this.router.navigateByUrl(`/projects`);
  }

  onClose() {
    this.commentForm.reset();
    this.commentCreation = false;
  }

  addComment() {
    this.commentCreation = true;

    this.commentForm = this.formBuilder.group({
      content: [''],
      image: [''],
    });
  }

  onCommentCreate() {
    if (this.commentForm.valid) {
      const authorId = this.currentUserId;
      const noteId = this.noteId;
      const commentValue = { ...this.commentForm.value, authorId, noteId };

      this.notesServise.createComment(commentValue).subscribe({
        next: () => {
          this.onClose();
          this.comments$ = this.notesService.getComments(this.noteId);
          alert('Comment was successfully created.');
        },
        error: (error) => {
          this.errorMessage = error.message;
          setTimeout(() => {
            this.onClose();
          }, 2000);
          alert('Comment was not created.');
        },
      });
    }
  }

  onDeleteComment(commentId: string) {
    this.notesServise.deleteComment(commentId).subscribe();
    alert('Comment was successfully deleted.');

    this.notesService.getComments(this.noteId)

    this.router.navigateByUrl(`/projects`);
  }
}
