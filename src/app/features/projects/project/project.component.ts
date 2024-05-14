import { Component, Input } from '@angular/core';

import { Project } from '@shared/models/project.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  @Input() project!: Project;
}
