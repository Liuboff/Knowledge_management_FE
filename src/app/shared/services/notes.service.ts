import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { Note } from '@shared/models/note.model';
import { Category } from '@shared/models/category.model';
import { Comment } from '@shared/models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private http: HttpClient) {}
  api: string = `http://localhost:3000/api/v1`;

  createNote(note: FormData): Observable<Note> {
    return this.http.post<Note>(`${this.api}/notes/`, note).pipe(
      map((response: Note) => {
        console.log(response);
        return response;
      }),
      catchError(this.handleError),
    );
  }

  updateNote(noteId: string, note: FormData): Observable<Note> {
    return this.http.put<Note>(`${this.api}/notes/${noteId}`, note).pipe(
      map((response: Note) => {
        console.log('updateNote-', response);
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}/notes/`).pipe(
      map((response: Note[]) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getUserNotes(userId: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}/notes/notesByUser/${userId}`).pipe(
      map((response: Note[]) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getProjectNotes(projectId: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}/notes/notesByProject/${projectId}`).pipe(
      map((response: Note[]) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getNoteById(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.api}/notes/${id}`).pipe(
      catchError(this.handleError),
    );
  }

  deleteNote(notetId: string) {
    return this.http.delete<{success: boolean, message: string}>(`${this.api}/notes/${notetId}`).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories/`).pipe(
      map((response: Category[]) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getComments(noteId: string) {
    return this.http.get<Comment[]>(`${this.api}/notes/comments/${noteId}`).pipe(
      map((response: Comment[]) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.api}/notes/commentCreate`, comment).pipe(
      map((response: Comment) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  deleteComment(commentId: string) {
    return this.http.delete<{success: boolean, message: string}>(`${this.api}/notes/comments/${commentId}`).pipe(
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
