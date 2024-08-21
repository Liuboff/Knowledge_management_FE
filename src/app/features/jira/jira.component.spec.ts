// jira.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { JiraComponent } from './jira.component';
import { MasterService } from '@shared/services/master.service';
import { AuthService } from '@shared/services/auth.service';
import { ProjectsService } from '@shared/services/projects.service';
import { of } from 'rxjs';

describe('JiraComponent', () => {
  let component: JiraComponent;
  let fixture: ComponentFixture<JiraComponent>;
  let masterService: MasterService;
  let authService: AuthService;
  let projectsService: ProjectsService;

  const authServiceMock = {
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(of({ id: '123' }))
  };

  const projectsServiceMock = {
    getUserProjects: jasmine.createSpy('getUserProjects').and.returnValue(of([])),
    getProjectTeam: jasmine.createSpy('getProjectTeam').and.returnValue(of([])),
    getProjectTasks: jasmine.createSpy('getProjectTasks').and.returnValue(of([])),
    createTask: jasmine.createSpy('createTask').and.returnValue(of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JiraComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [
        MasterService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: ProjectsService, useValue: projectsServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JiraComponent);
    component = fixture.componentInstance;
    masterService = TestBed.inject(MasterService);
    authService = TestBed.inject(AuthService);
    projectsService = TestBed.inject(ProjectsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllProjects on init', () => {
    spyOn(component, 'getAllProjects');
    component.ngOnInit();
    expect(component.getAllProjects).toHaveBeenCalled();
  });

  it('should set project on setProject call', () => {
    const project = { id: '1', name: 'Test Project' };
    component.setProject(project);
    expect(component.currentProject).toBe(project);
    expect(projectsService.getProjectTeam).toHaveBeenCalledWith('1');
    expect(projectsService.getProjectTasks).toHaveBeenCalledWith('1');
  });

  it('should filter tasks by status', () => {
    component.taskList = [
      { status: 'To Do' },
      { status: 'In Progress' },
      { status: 'Done' }
    ] as any[];
    expect(component.filterTasks('To Do').length).toBe(1);
    expect(component.filterTasks('In Progress').length).toBe(1);
    expect(component.filterTasks('Done').length).toBe(1);
  });

  it('should create a task and call getAllProjectTasks', () => {
    spyOn(component, 'getAllProjectTasks');
    spyOn(window, 'alert');
    component.onTaskCreate();
    expect(projectsService.createTask).toHaveBeenCalledWith(component.taskObj);
    expect(component.getAllProjectTasks).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Successfully created task.');
  });

});
