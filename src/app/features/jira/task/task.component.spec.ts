import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TaskComponent } from './task.component';
import { AuthService } from '@shared/services/auth.service';
import { ProjectsService } from '@shared/services/projects.service';
import { Task } from '@shared/models/task.model';
import { User } from '@shared/models/user.model';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let authService: AuthService;
  let projectsService: ProjectsService;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    content: 'Test Content',
    taskStatus: 'To Do',
    status: 'To Do',
    storyPoint: 5,
    assigneeId: '123',
    dateStart: '2023-06-01'
  };

  const mockUser: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => '1' })
          }
        },
        {
          provide: ProjectsService,
          useValue: {
            getTaskById: jasmine.createSpy('getTaskById').and.returnValue(of(mockTask))
          }
        },
        {
          provide: AuthService,
          useValue: {
            getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue(of(mockUser))
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    projectsService = TestBed.inject(ProjectsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch task and assignee on init', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(projectsService.getTaskById).toHaveBeenCalledWith('1');
      expect(authService.getUserInfo).toHaveBeenCalledWith('123');
      expect(component.task).toEqual(mockTask);
      component.assignee$.subscribe((assignee) => {
        expect(assignee).toEqual(mockUser);
      });
    });
  }));

  it('should display task details correctly', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.task__title')!.textContent).toContain('Test Task');
      expect(compiled.querySelector('.task__name')!.textContent).toContain('John Doe');
      expect(compiled.querySelector('.col-3.my-1.fw-bold.text-end')!.textContent).toContain('Jun 1, 2023');
      expect(compiled.querySelector('.task__description .text-muted')!.textContent).toContain('Test Content');
    });
  }));

  it('should allow status change', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const select: HTMLSelectElement = fixture.debugElement.query(By.css('select[name="assignedTo"]')).nativeElement;
      select.value = select.options[2].value; // Select 'Done'
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(component.task.status).toBe('Done');
    });
  }));
});
