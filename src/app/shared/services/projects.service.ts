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

  getUserProjects(userId: string): Observable<Project[]> {
    return this.http.get<Project[]>(`http://localhost:3000/api/v1/projects/userProjectsByUserId/${userId}`).pipe(
      map((response: Project[]) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getProjectTeam(projectId: string): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:3000/api/v1/projects/teamByprojectId/${projectId}`).pipe(
      map((response: User[]) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getProjectTasks(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`http://localhost:3000/api/v1/projects/tasksByProjectId/${projectId}`).pipe(
      map((response: Task[]) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getProjectById(projectId: string): Observable<Project> {
    return this.http.get<Project>(`http://localhost:3000/api/v1/projects/${projectId}`).pipe(
      map((response: Project) => {
        return response;
      }),

      catchError(this.handleError),
    );
  }

  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`http://localhost:3000/api/v1/tasks/${taskId}`).pipe(
      map((response: Task) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`http://localhost:3000/api/v1/tasks`, task).pipe(
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
