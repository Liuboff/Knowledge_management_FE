import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { forkJoin, map, Subscription, switchMap } from 'rxjs';

import { Category } from '@shared/models/category.model';
import { Note } from '@shared/models/note.model';
import { NotesService } from '@shared/services/notes.service';

@Component({
  selector: 'app-note-update',
  templateUrl: './note-update.component.html',
  styleUrls: ['./note-update.component.scss']
})
export class NoteUpdateComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  note!: Note;
  noteId!: string;
  noteForm!: FormGroup;
  errorMessage: string = '';

  categories!: Category[];
  imageDisplay!: string | ArrayBuffer | null;

  constructor(
    private formBuilder: FormBuilder,
    private notesService: NotesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')!),
      switchMap(id => {
        this.noteId = id;
        return forkJoin([
          this.notesService.getNoteById(this.noteId),
          this.notesService.getCategories(),
        ]);
      })
    ).subscribe(([note, categories]) => {
      this.note = note;
      this.categories = categories;
      this.initializeForm(note);
    });

    this.noteForm = this.formBuilder.group({
      title: [''],
      content: [''],
      image: [''],
      category: ['']
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initializeForm(note: Note): void {
    this.noteForm.patchValue({
      title: note.title,
      content: note.content,
      image: note.image,
      category: note.category,
    });

    if (note.image) {
      this.imageDisplay = note.image;
    }
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      const updatedFields = new FormData();

      Object.keys(this.noteForm.controls).forEach(key => {
        if (this.noteForm.get(key)?.dirty) {
          updatedFields.append(key, this.noteForm.get(key)?.value);
        }
      });

      this.notesService.updateNote(this.noteId, updatedFields).subscribe({
        next: () => {
          this.onClose();
          this.router.navigateByUrl(`/notes?projectId=${this.note.project}`);
          alert('Note was successfully updated.');
        },
        error: (error) => {
          this.errorMessage = error.message;
          setTimeout(() => {
            this.onClose();
          }, 2000);
          alert('Note was not updated.');
          this.router.navigateByUrl('/projects');
        },
      });
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.noteForm.patchValue({image: file});
      this.noteForm.get('image')?.markAsDirty();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      }
      fileReader.readAsDataURL(file);
    }
  }

  onClose() {
    this.noteForm.reset();
  }
}
