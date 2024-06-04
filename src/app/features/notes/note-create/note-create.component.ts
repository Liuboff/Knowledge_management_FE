import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Category } from '@shared/models/category.model';
import { Project } from '@shared/models/project.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth.service';
import { NotesService } from '@shared/services/notes.service';
import { ProjectsService } from '@shared/services/projects.service';

@Component({
  selector: 'app-note-create',
  templateUrl: './note-create.component.html',
  styleUrls: ['./note-create.component.scss'],
})
export class NoteCreateComponent implements OnInit {
  noteForm!: FormGroup;
  errorMessage: string = '';
  currentUser!: User;
  currentUserId!: string;

  categories!: Category[];
  projects!: Project[];
  imageDisplay!: string | ArrayBuffer | null;

  constructor(
    private formBuilder: FormBuilder,
    private notesServise: NotesService,
    private projectsServise: ProjectsService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.noteForm = this.formBuilder.group({
      title: [''],
      content: [''],
      image: [''],
      category: [''],
      project: ['']
    });

    this.auth.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
        if (user.id) this.currentUserId = user.id;
      }
    });

    this.notesServise.getCategories().subscribe((categories) => {
      if (categories) {
        this.categories = categories;
      }
    });

    this.projectsServise.getUserProjects(this.currentUserId).subscribe((projects) => {
      if (projects) {
        this.projects = projects;
      }
    });
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      const noteFormData = new FormData();

      Object.keys(this.noteForm.controls).forEach(key => {
        noteFormData.append(key, this.noteForm.get(key)?.value);
      });

      noteFormData.append('authorId', this.currentUserId);

      this.notesServise.createNote(noteFormData).subscribe({
        next: () => {
          let proj = this.noteForm.get('project')?.value;
          this.onClose();
          this.router.navigateByUrl(`/notes?projectId=${proj}`);
          alert('Note was successfully created.');
        },
        error: (error) => {
          this.errorMessage = error.message;
          setTimeout(() => {
            this.onClose();
          }, 2000);
          alert('Note was not created.');
          this.router.navigateByUrl('/notes/create');
        },
      });

    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.noteForm.patchValue({image: file});
      this.noteForm.get('image')?.updateValueAndValidity();
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
