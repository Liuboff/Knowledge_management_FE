import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoteUpdateComponent } from './note-update.component';
import { NotesService } from '@shared/services/notes.service';
import { Note } from '@shared/models/note.model';
import { EditorModule } from '@tinymce/tinymce-angular';

describe('NoteUpdateComponent', () => {
  let component: NoteUpdateComponent;
  let fixture: ComponentFixture<NoteUpdateComponent>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockNotesService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockActivatedRoute = {
      paramMap: of({ get: (id: string) => 'mock-note-id' })
    };
    mockNotesService = {
      updateNote: (noteId: string, note: FormData) => of({ title: 'Updated Title', content: 'Updated Content' } as Note)
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditorModule],
      declarations: [NoteUpdateComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NotesService, useValue: mockNotesService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    const editorElement = document.querySelector('textarea[id=content]');
    if (editorElement) {
      editorElement.remove();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
