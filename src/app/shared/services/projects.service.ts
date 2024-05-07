import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Project } from '@shared/models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http: HttpClient) {}

  // getUserProjects(projectsIds: string[]): Observable<Project[]> {
  //   return this.http.post<Project[]>(`http://localhost:3000/api/v1/projects/userProjectsByIds`, projectsIds).pipe(
  //     map((response: Project[]) => {
  //       return response;
  //     }),

  //     catchError(this.handleError),
  //   );
  // }

  getUserProjects(userId: string): Observable<Project[]> {
    return this.http.get<Project[]>(`http://localhost:3000/api/v1/users/projects/${userId}`).pipe(
      map((response: Project[]) => {
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
