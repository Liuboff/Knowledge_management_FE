import { Component, OnInit } from '@angular/core';

import { Project } from '@shared/models/project.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth.service';
import { ProjectsService } from '@shared/services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  constructor(private auth: AuthService, private projectsServise: ProjectsService) {}

  projects: Project[] = [];
  userId!: string;
  user!: User;

  ngOnInit() {
    this.auth.getCurrentUser().subscribe(user => this.userId = user?.id!);

    this.projectsServise.getUserProjects(this.userId).subscribe(projects => this.projects = projects);

  }
}
