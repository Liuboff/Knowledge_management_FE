import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProjectsComponent } from './projects.component';
import { AuthService } from '@shared/services/auth.service';
import { ProjectsService } from '@shared/services/projects.service';
import { Project } from '@shared/models/project.model';
import { User } from '@shared/models/user.model';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let authService: AuthService;
  let projectsService: ProjectsService;

  const mockUser: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password',
    token: 'token'
  };

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Test Project 1',
      dateStart: '2023-01-01',
      dateEnd: '2023-12-31',
      team: [],
      tasks: []
    },
    {
      id: '2',
      name: 'Test Project 2',
      dateStart: '2023-02-01',
      dateEnd: '2023-11-30',
      team: [],
      tasks: []
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        AuthService,
        ProjectsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    projectsService = TestBed.inject(ProjectsService);

    spyOn(authService, 'getCurrentUser').and.returnValue(of(mockUser));
    spyOn(projectsService, 'getUserProjects').and.returnValue(of(mockProjects));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display user projects', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.projects).toEqual(mockProjects);
      const compiled = fixture.nativeElement as HTMLElement;
      const projectTitles = compiled.querySelectorAll('.project__title');
      expect(projectTitles.length).toBe(2);
      expect(projectTitles[0].textContent).toContain('Test Project 1');
      expect(projectTitles[1].textContent).toContain('Test Project 2');
    });
  }));

  it('should display user projects details correctly', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const projectInfos = compiled.querySelectorAll('.project__info');
      const projectDates = compiled.querySelectorAll('.project__date');

      expect(projectInfos[0].textContent).toContain('Our purpose is to develop information system for Knowledge management in IT projects');
      expect(projectInfos[1].textContent).toContain('Our purpose is to develop information system for Knowledge management in IT projects');

      expect(projectDates[0].textContent).toContain('01.01.2023 - 31.12.2023');
      expect(projectDates[1].textContent).toContain('01.02.2023 - 30.11.2023');
    });
  }));
});
