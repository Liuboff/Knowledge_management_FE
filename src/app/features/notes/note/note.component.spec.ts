import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteComponent } from './note.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NotesService } from '@shared/services/notes.service';
import { AuthService } from '@shared/services/auth.service';
import { Note } from '@shared/models/note.model';
import { Comment } from '@shared/models/comment.model';
import { User } from '@shared/models/user.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('NoteComponent', () => {
  let component: NoteComponent;
  let fixture: ComponentFixture<NoteComponent>;
  let notesServiceStub: Partial<NotesService>;
  let authServiceStub: Partial<AuthService>;
  let router: Router;
  let route: ActivatedRoute;

  const dummyNote: Note = {
    id: '1',
    authorId: '1',
    title: 'Test Note',
    content: 'This is a test note',
  };

  const dummyUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const dummyComments: Comment[] = [
    { id: '1', content: 'Test comment', authorId: '2', noteId: '1' },
  ];

  beforeEach(async () => {
    notesServiceStub = {
      getNoteById: jasmine.createSpy('getNoteById').and.returnValue(of(dummyNote)),
      getComments: jasmine.createSpy('getComments').and.returnValue(of(dummyComments)),
      deleteNote: jasmine.createSpy('deleteNote').and.returnValue(of({ success: true, message: 'Note deleted' })),
      createComment: jasmine.createSpy('createComment').and.returnValue(of(dummyComments[0])),
      deleteComment: jasmine.createSpy('deleteComment').and.returnValue(of({ success: true, message: 'Comment deleted' })),
    };

    authServiceStub = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(of(dummyUser)),
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue(of(dummyUser)),
    };

    await TestBed.configureTestingModule({
      declarations: [NoteComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: NotesService, useValue: notesServiceStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => '1' }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize current user and author information', () => {
    component.ngOnInit();
    expect(authServiceStub.getCurrentUser).toHaveBeenCalled();
    expect(authServiceStub.getUserInfo).toHaveBeenCalledWith(dummyNote.authorId);
    expect(component.author).toEqual(dummyUser);
  });

  it('should set isAuthor to true if current user is the author of the note', () => {
    component.ngOnInit();
    expect(component.isAuthor).toBe(true);
  });

  it('should delete note and navigate to projects', () => {
    spyOn(router, 'navigateByUrl');
    component.deleteNote('1');
    expect(notesServiceStub.deleteNote).toHaveBeenCalledWith('1');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/projects');
  });

  it('should reset comment form and set commentCreation to false on onClose', () => {
    component.addComment();
    component.onClose();
    expect(component.commentForm.pristine).toBe(true);
    expect(component.commentCreation).toBe(false);
  });

  it('should create a new comment if form is valid', () => {
    const formBuilderSpy = spyOn(TestBed.inject(FormBuilder), 'group').and.returnValue(
      new FormBuilder().group({
        content: [''],
        image: [''],
      })
    );

    component.addComment();
    expect(formBuilderSpy).toHaveBeenCalled();

    component.commentForm.controls['content'].setValue('New comment');
    component.commentForm.controls['image'].setValue('');
    component.onCommentCreate();
    expect(notesServiceStub.createComment).toHaveBeenCalled();
    expect(component.commentCreation).toBe(false);
  });

  it('should delete comment and refresh comments', () => {
    component.onDeleteComment('1');
    expect(notesServiceStub.deleteComment).toHaveBeenCalledWith('1');
    expect(notesServiceStub.getComments).toHaveBeenCalledWith('1');
  });
});
