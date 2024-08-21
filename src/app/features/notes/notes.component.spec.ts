import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesComponent } from './notes.component';
import { NotesService } from '@shared/services/notes.service';
import { ActivatedRoute } from '@angular/router';
import { Note } from '@shared/models/note.model';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  let notesServiceStub: Partial<NotesService>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  const dummyNotes: Note[] = [
    { id: '1', title: 'Note 1', dateCreated: '2024-01-01T10:00:00Z' },
    { id: '2', title: 'Note 2', dateCreated: '2024-01-02T11:00:00Z' },
  ];

  beforeEach(async () => {
    notesServiceStub = { getProjectNotes: jasmine.createSpy('getProjectNotes').and.returnValue(of(dummyNotes)) };
    activatedRouteStub = { queryParams: of({ projectId: '123' }) };

    await TestBed.configureTestingModule({
      declarations: [NotesComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: NotesService, useValue: notesServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize project ID and fetch project notes on init', () => {
    expect(component.prId).toBe('123');
    expect(notesServiceStub.getProjectNotes).toHaveBeenCalledWith('123');
    component.notes$.subscribe(notes => {
      expect(notes).toEqual(dummyNotes);
    });
  });

  it('should display notes', () => {
    const noteElements = fixture.debugElement.queryAll(By.css('.note'));
    expect(noteElements.length).toBe(2);
    expect(noteElements[0].nativeElement.textContent).toContain('Note 1');
    expect(noteElements[1].nativeElement.textContent).toContain('Note 2');
  });
});
