import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProjectsService } from './projects.service';
import { Project } from '@shared/models/project.model';
import { User } from '@shared/models/user.model';
import { Task } from '@shared/models/task.model';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectsService]
    });
    service = TestBed.inject(ProjectsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user projects', () => {
    const mockUserId = 'user123';
    const mockProjects: Project[] = [{ id: 'proj1', name: 'Project 1' }];

    service.getUserProjects(mockUserId).subscribe((projects: Project[]) => {
      expect(projects).toEqual(mockProjects);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/projects/userProjectsByUserId/${mockUserId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });

  it('should return project team', () => {
    const mockProjectId = 'proj1';
    const mockTeam: User[] = [{ id: 'user123', email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe' }];

    service.getProjectTeam(mockProjectId).subscribe((team: User[]) => {
      expect(team).toEqual(mockTeam);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/projects/teamByprojectId/${mockProjectId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeam);
  });

  it('should return project tasks', () => {
    const mockProjectId = 'proj1';
    const mockTasks: Task[] = [{ id: 'task1', title: 'Task 1', content: 'Task content', status: 'To Do', taskStatus: 'To Do', storyPoint: 3 }];

    service.getProjectTasks(mockProjectId).subscribe((tasks: Task[]) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/projects/tasksByProjectId/${mockProjectId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

});
