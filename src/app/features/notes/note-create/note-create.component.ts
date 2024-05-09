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
      tags: [''],
      categories: [[]],
      project: [[]],
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
      const projects = this.projects;
      const tasks = this.currentUser.tasks;
      const authorId = this.currentUserId;
      const noteValue = { ...this.noteForm.value, projects, tasks, authorId };

      this.notesServise.createNote(noteValue).subscribe({
        next: () => {
          this.onClose();
          this.router.navigateByUrl('notes');
        },
        error: (error) => {
          this.errorMessage = error.message;
          setTimeout(() => {
            this.onClose();
          }, 2000);
          this.router.navigateByUrl('');
        },
      });
    }
  }

  onClose() {
    this.noteForm.reset();
    this.router.navigateByUrl('');
  }
}
