import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Project } from '@shared/models/project.model';
import { AuthService } from '@shared/services/auth.service';
import { ProjectsService } from '@shared/services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  userId!: string;
  private subscription: Subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.subscription = this.auth.getCurrentUser().pipe(
      switchMap(user => {
        this.userId = user?.id!;
        return this.projectsService.getUserProjects(this.userId);
      })
    ).subscribe(projects => {
      this.projects = projects;
    });
  }

  // ngOnDestroy() {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }
}
