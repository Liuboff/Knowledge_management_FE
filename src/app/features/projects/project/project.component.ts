import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Project } from '@shared/models/project.model';
import { ProjectsService } from '@shared/services/projects.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnInit, OnDestroy {
  projectId!: string;
  project!: Project;
  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private projectsService: ProjectsService) {}

  ngOnInit() {
    this.subscription = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')!),
      switchMap(id => {
        this.projectId = id;
        return this.projectsService.getProjectById(this.projectId);
      })
    ).subscribe(project => {
      this.project = project;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
