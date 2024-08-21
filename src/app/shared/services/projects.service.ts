import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Project } from '@shared/models/project.model';
import { User } from '@shared/models/user.model';
import { Task } from '@shared/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http: HttpClient) {}
  api: string = `http://localhost:3000/api/v1`;

  getUserProjects(userId: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.api}/projects/userProjectsByUserId/${userId}`).pipe(
      map((response: Project[]) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getProjectTeam(projectId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/projects/teamByprojectId/${projectId}`).pipe(
      map((response: User[]) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getProjectTasks(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.api}/projects/tasksByProjectId/${projectId}`).pipe(
      map((response: Task[]) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getProjectById(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${this.api}/projects/${projectId}`).pipe(
      map((response: Project) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.api}/tasks/${taskId}`).pipe(
      map((response: Task) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.api}/tasks`, task).pipe(
      map((response: Task) => {
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
