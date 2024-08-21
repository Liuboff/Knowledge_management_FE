import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TaskPreviewComponent } from './task-preview.component';
import { AuthService } from '@shared/services/auth.service';
import { Task } from '@shared/models/task.model';
import { User } from '@shared/models/user.model';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('TaskPreviewComponent', () => {
  let component: TaskPreviewComponent;
  let fixture: ComponentFixture<TaskPreviewComponent>;
  let authService: AuthService;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    content: 'Test Content',
    taskStatus: 'To Do',
    status: 'To Do',
    storyPoint: 5,
    assigneeId: '123'
  };

  const mockUser: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskPreviewComponent],
      imports: [RouterTestingModule],
      providers: [
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
    fixture = TestBed.createComponent(TaskPreviewComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch assignee on init', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(authService.getUserInfo).toHaveBeenCalledWith('123');
      component.assignee$.subscribe((assignee) => {
        expect(assignee).toEqual(mockUser);
      });
    });
  }));

  it('should display task title', () => {
    const taskTitleElement = fixture.debugElement.query(By.css('.my-1.fw-bold')).nativeElement;
    expect(taskTitleElement.textContent).toContain('Test Task');
  });

  it('should display assignee name', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const assigneeElement = fixture.debugElement.query(By.css('.space-font.m-0.pointer')).nativeElement;
      expect(assigneeElement.textContent).toContain('John Doe');
    });
  }));

  it('should display task content', () => {
    const taskContentElement = fixture.debugElement.query(By.css('.text-muted.space-font.m-0')).nativeElement;
    expect(taskContentElement.textContent).toContain('Test Content');
  });

  it('should display story points', () => {
    const storyPointsElement = fixture.debugElement.query(By.css('.text-end')).nativeElement;
    expect(storyPointsElement.textContent).toContain('Story Points: 5');
  });
});
