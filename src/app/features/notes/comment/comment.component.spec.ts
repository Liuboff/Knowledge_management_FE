import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommentComponent } from './comment.component';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    component.comment = {
      id: '1',
      content: 'This is a test comment.',
      image: 'path/to/image.jpg',
      dateCreated: '2024-06-04T12:00:00Z',
      authorId: 'authorId',
      noteId: 'noteId'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display comment content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const contentElement = compiled.querySelector('.comment__content');
    expect(contentElement?.textContent).toContain('This is a test comment.');
  });
});
