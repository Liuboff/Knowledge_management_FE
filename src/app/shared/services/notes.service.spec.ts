import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotesService } from './notes.service';
import { Note } from '@shared/models/note.model';
import { Comment } from '@shared/models/comment.model';
import { Category } from '@shared/models/category.model';

describe('NotesService', () => {
  let service: NotesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotesService],
    });
    service = TestBed.inject(NotesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch notes', () => {
    const dummyNotes: Note[] = [
      { id: '1', title: 'Note 1' },
      { id: '2', title: 'Note 2' },
    ];

    service.getNotes().subscribe(notes => {
      expect(notes.length).toBe(2);
      expect(notes).toEqual(dummyNotes);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/notes/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyNotes);
  });

  it('should create a note', () => {
    const newNote: Note = { id: '3', title: 'New Note' };

    service.createNote(new FormData()).subscribe(note => {
      expect(note).toEqual(newNote);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/notes/`);
    expect(req.request.method).toBe('POST');
    req.flush(newNote);
  });

  it('should update a note', () => {
    const updatedNote: Note = { id: '1', title: 'Updated Note' };

    service.updateNote('1', new FormData()).subscribe(note => {
      expect(note).toEqual(updatedNote);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/notes/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedNote);
  });

  it('should delete a note', () => {
    const response = { success: true, message: 'Note deleted' };

    service.deleteNote('1').subscribe(res => {
      expect(res.success).toBe(true);
      expect(res.message).toBe('Note deleted');
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/notes/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(response);
  });

  it('should fetch categories', () => {
    const dummyCategories: Category[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];

    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/categories/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });

  it('should fetch comments', () => {
    const dummyComments: Comment[] = [
      { id: '1', content: 'Comment 1' },
      { id: '2', content: 'Comment 2' },
    ];

    service.getComments('1').subscribe(comments => {
      expect(comments.length).toBe(2);
      expect(comments).toEqual(dummyComments);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/notes/comments/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyComments);
  });

  it('should create a comment', () => {
    const newComment: Comment = { id: '3', content: 'New Comment' };

    service.createComment(newComment).subscribe(comment => {
      expect(comment).toEqual(newComment);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/notes/commentCreate`);
    expect(req.request.method).toBe('POST');
    req.flush(newComment);
  });

  it('should delete a comment', () => {
    const response = { success: true, message: 'Comment deleted' };

    service.deleteComment('1').subscribe(res => {
      expect(res.success).toBe(true);
      expect(res.message).toBe('Comment deleted');
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/notes/comments/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(response);
  });
});
