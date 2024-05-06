import { Component, ElementRef, Renderer2, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideComponent implements OnInit {

  constructor(private renderer: Renderer2, private el: ElementRef, private cd: ChangeDetectorRef) {}

  projects: any = [];
  notes: any = [];
  // links = ['Notes', 'Ideas', 'Resources', 'Team'];

  ngOnInit(): void {
    this.projects = [
      {
        name: 'Project 5',
        links: ['Notes', 'Ideas', 'Resources', 'Team']
      },
      {
        name: 'Project 2',
        links: ['Notes', 'Ideas', 'Resources', 'Team']
      },
    ];

    this.notes = [
      {
        name: 'Note 1',
        links: ['Notes', 'Ideas', 'Resources', 'Team']
      },
      {
        name: 'Note 2',
        links: ['Notes', 'Ideas', 'Resources', 'Team']
      },
    ];

    // this.cd.markForCheck();

    const toggler = this.el.nativeElement.querySelectorAll('.caret');
    toggler.forEach((t: Element) => {
      this.renderer.listen(t, 'click', () => {
        const nested = t.parentElement?.querySelector('.nested');
        if (nested) {
          nested.classList.toggle('active');
        }
        t.classList.toggle('caret-down');
      });
      // this.cd.markForCheck();
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
