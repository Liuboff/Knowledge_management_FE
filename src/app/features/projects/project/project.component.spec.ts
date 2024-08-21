import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProjectComponent } from './project.component';
import { ProjectsService } from '@shared/services/projects.service';
import { Project } from '@shared/models/project.model';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let projectsService: ProjectsService;
  const mockProject: Project = {
    id: '1',
    name: 'Test Project',
    dateStart: '2023-01-01',
    dateEnd: '2023-12-31',
    team: [],
    tasks: []
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        ProjectsService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => '1'
            })
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    projectsService = TestBed.inject(ProjectsService);

    spyOn(projectsService, 'getProjectById').and.returnValue(of(mockProject));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display project details', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.project__title')?.textContent).toContain('Test Project');
      expect(compiled.querySelector('.project__info')?.textContent).toContain('The Knowledge Management Information System');
    });
  }));
});
