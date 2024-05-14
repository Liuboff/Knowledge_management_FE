import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';

import { Note } from '@shared/models/note.model';
import { Api } from '../models/api.model';
import { Category } from '@shared/models/category.model';
import { Comment } from '@shared/models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private http: HttpClient) {}

  private notesAllSubject: BehaviorSubject<Note[] | null> = new BehaviorSubject<Note[] | null>(null);
  private notesCurrentUserSubject: BehaviorSubject<Note[] | null> = new BehaviorSubject<Note[] | null>(null);

  setAllNotesList(notesList: Note[]): void {
    this.notesAllSubject.next(notesList);
  }

  getAllNotesList(): Observable<Note[] | null> {
    return this.notesAllSubject.asObservable();
  }

  setCurrentUserNotesList(notesList: Note[]): void {
    this.notesCurrentUserSubject.next(notesList);
  }

  getCurrentUserNotesList(): Observable<Note[] | null> {
    return this.notesCurrentUserSubject.asObservable();
  }

  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(`http://localhost:3000/api/v1/notes/`, note).pipe(
      map((response: Note) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`http://localhost:3000/api/v1/notes/`).pipe(
      map((response: Note[]) => {
        this.setAllNotesList(response);
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getUserNotes(userId: string): Observable<Note[]> {
    return this.http.get<Note[]>(`http://localhost:3000/api/v1/notes/notesByUser/${userId}`).pipe(
      map((response: Note[]) => {
        this.setCurrentUserNotesList(response);
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getProjectNotes(projectId: string): Observable<Note[]> {
    return this.http.get<Note[]>(`http://localhost:3000/api/v1/notes/notesByProject/${projectId}`).pipe(
      map((response: Note[]) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getNoteById(id: string): Observable<Note> {
    return this.http.get<Note>(`http://localhost:3000/api/v1/notes/${id}`).pipe(
      catchError(this.handleError),
    );
  }

  deleteNote(notetId: string) {
    return this.http.delete<{success: boolean, message: string}>(`http://localhost:3000/api/v1/notes/${notetId}`).pipe(
      map((response) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`http://localhost:3000/api/v1/categories/`).pipe(
      map((response: Category[]) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getComments(noteId: string) {
    return this.http.get<Comment[]>(`http://localhost:3000/api/v1/notes/comments/${noteId}`).pipe(
      map((response: Comment[]) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`http://localhost:3000/api/v1/notes/commentCreate`, comment).pipe(
      map((response: Comment) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  deleteComment(commentId: string) {
    return this.http.delete<{success: boolean, message: string}>(`http://localhost:3000/api/v1/notes/comments/${commentId}`).pipe(
      map((response) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error}`;
      console.error(error);
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
