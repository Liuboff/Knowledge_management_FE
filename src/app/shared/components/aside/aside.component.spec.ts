import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsideComponent } from './aside.component';
import { AuthService } from '@shared/services/auth.service';
import { NotesService } from '@shared/services/notes.service';
import { ProjectsService } from '@shared/services/projects.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Renderer2 } from '@angular/core';
import { User } from '@shared/models/user.model';

describe('AsideComponent', () => {
  let component: AsideComponent;
  let fixture: ComponentFixture<AsideComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notesServiceSpy: jasmine.SpyObj<NotesService>;
  let projectsServiceSpy: jasmine.SpyObj<ProjectsService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const notesSpy = jasmine.createSpyObj('NotesService', ['getUserNotes']);
    const projectsSpy = jasmine.createSpyObj('ProjectsService', ['getUserProjects']);

    await TestBed.configureTestingModule({
      declarations: [AsideComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: NotesService, useValue: notesSpy },
        { provide: ProjectsService, useValue: projectsSpy },
        Renderer2 // Add Renderer2 to the providers
      ]
    })
    .compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notesServiceSpy = TestBed.inject(NotesService) as jasmine.SpyObj<NotesService>;
    projectsServiceSpy = TestBed.inject(ProjectsService) as jasmine.SpyObj<ProjectsService>;

    const mockUser: User = { id: 'user123', email: 'user@example.com' };
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
    notesServiceSpy.getUserNotes.and.returnValue(of([]));
    projectsServiceSpy.getUserProjects.and.returnValue(of([]));

    fixture = TestBed.createComponent(AsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user projects and notes on init', () => {
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(notesServiceSpy.getUserNotes).toHaveBeenCalledWith('user123');
    expect(projectsServiceSpy.getUserProjects).toHaveBeenCalledWith('user123');
  });

  it('should toggle nested elements on click', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const caret = compiled.querySelector('.caret') as HTMLElement;
    if (caret) {
      caret.click();
      fixture.detectChanges();
      expect(caret.classList).toContain('caret-down');
    }
  });
});
