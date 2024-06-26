import {
  Component,
  ElementRef,
  Renderer2,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Note } from '@shared/models/note.model';
import { Project } from '@shared/models/project.model';
import { AuthService } from '@shared/services/auth.service';
import { NotesService } from '@shared/services/notes.service';
import { ProjectsService } from '@shared/services/projects.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private notesServise: NotesService,
    private projectsServise: ProjectsService,
    private auth: AuthService
  ) {}

  currentUserId!: string;
  projects: Project[] = [];
  notes: Note[] = [];

  ngOnInit(): void {

    this.auth.getCurrentUser().subscribe((user) => {
      this.currentUserId = user?.id!;
    });

    this.projectsServise.getUserProjects(this.currentUserId).subscribe((projects) => {
        this.projects = projects!;
        this.cd.markForCheck();
    });

    this.notesServise.getUserNotes(this.currentUserId).subscribe((notes) => {
      this.notes = notes!;
      this.cd.markForCheck();
    });

    const toggler = this.el.nativeElement.querySelectorAll('.caret');
    toggler.forEach((t: Element) => {
      this.renderer.listen(t, 'click', () => {
        const nested = t.parentElement?.querySelector('.nested');
        if (nested) {
          nested.classList.toggle('active');
        }
        t.classList.toggle('caret-down');
      });
      this.cd.markForCheck();
    });

  }

  toggleNested(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const nested = target.nextElementSibling;
    if (nested) {
      nested.classList.toggle('active');
    }
    target.classList.toggle('caret-down');
  }
}
