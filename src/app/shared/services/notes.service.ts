import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { Note } from '@shared/models/note.model';
import { Api } from '../models/api.model';
import { Category } from '@shared/models/category';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private http: HttpClient) {}

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
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getUserNotes(userId: string): Observable<Note[]> {
    return this.http.get<Note[]>(`http://localhost:3000/api/v1/users/usernotes/${userId}`).pipe(
      map((response: Note[]) => {
        return response;
      }),
      
      catchError(this.handleError),
    );
  }

  getNoteById(id: string): Observable<Note> {
    return this.http.get<Note>(`http://localhost:3000/api/v1/notes/${id}`).pipe(
      // map((response: Note) => {
        // return response;
      // }),

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
