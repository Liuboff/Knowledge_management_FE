import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { NoteCreateComponent } from './note-create.component';
import { AuthService } from '@shared/services/auth.service';
import { NotesService } from '@shared/services/notes.service';
import { ProjectsService } from '@shared/services/projects.service';
import { User } from '@shared/models/user.model';
import { EditorModule } from '@tinymce/tinymce-angular';

describe('NoteCreateComponent', () => {
  let component: NoteCreateComponent;
  let fixture: ComponentFixture<NoteCreateComponent>;
  let authService: AuthService;
  let notesService: NotesService;
  let projectsService: ProjectsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoteCreateComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        EditorModule,
        RouterTestingModule
      ],
      providers: [
        AuthService,
        NotesService,
        ProjectsService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteCreateComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    notesService = TestBed.inject(NotesService);
    projectsService = TestBed.inject(ProjectsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    expect(component.noteForm).toBeDefined();
    expect(component.noteForm.controls['title']).toBeDefined();
    expect(component.noteForm.controls['content']).toBeDefined();
    expect(component.noteForm.controls['image']).toBeDefined();
    expect(component.noteForm.controls['category']).toBeDefined();
    expect(component.noteForm.controls['project']).toBeDefined();
  });

  it('should get current user on init', () => {
    const user: User = { id: '123', email: 'test@test.com' };
    spyOn(authService, 'getCurrentUser').and.returnValue(of(user));
    component.ngOnInit();
    expect(component.currentUser).toEqual(user);
    expect(component.currentUserId).toBe(user.id!); // Зміна тут
  });

  it('should get categories and projects on init', () => {
    const categories = [{ id: 'cat1', name: 'Category 1' }];
    const projects = [{ id: 'proj1', name: 'Project 1' }];
    spyOn(notesService, 'getCategories').and.returnValue(of(categories));
    spyOn(projectsService, 'getUserProjects').and.returnValue(of(projects));
    spyOn(authService, 'getCurrentUser').and.returnValue(of({ id: '123', email: 'test@test.com' }));

    component.ngOnInit();
    expect(component.categories).toEqual(categories);
    expect(component.projects).toEqual(projects);
  });

  it('should handle image upload', () => {
    const event = { target: { files: [new Blob()] } };
    component.onImageUpload(event);
    expect(component.noteForm.get('image')?.value).toBe(event.target.files[0]);
  });

  it('should reset form on close', () => {
    component.onClose();
    expect(component.noteForm.pristine).toBeTruthy();
    expect(component.noteForm.untouched).toBeTruthy();
  });

  it('should handle form submission', () => {
    const navigateSpy = spyOn((component as any).router, 'navigateByUrl');
    spyOn(notesService, 'createNote').and.returnValue(of({} as any));
    spyOn(authService, 'getCurrentUser').and.returnValue(of({ id: '123', email: 'test@test.com' }));

    component.ngOnInit();
    component.noteForm.patchValue({
      title: 'Test Title',
      content: 'Test Content',
      category: 'Test Category',
      project: 'Test Project'
    });

    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith('/notes?projectId=Test Project');
  });

  it('should handle form submission error', () => {
    const navigateSpy = spyOn((component as any).router, 'navigateByUrl');
    spyOn(notesService, 'createNote').and.returnValue(throwError(() => new Error('Error occurred')));
    spyOn(authService, 'getCurrentUser').and.returnValue(of({ id: '123', email: 'test@test.com' }));

    component.ngOnInit();
    component.noteForm.patchValue({
      title: 'Test Title',
      content: 'Test Content',
      category: 'Test Category',
      project: 'Test Project'
    });

    component.onSubmit();
    expect(component.errorMessage).toBe('Error occurred');
    expect(navigateSpy).toHaveBeenCalledWith('/notes/create');
  });
});
