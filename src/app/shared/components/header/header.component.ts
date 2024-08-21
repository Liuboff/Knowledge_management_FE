import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthService, private cdr: ChangeDetectorRef) {}

  isLoggedIn: boolean = false;
  initials: string = '';

  ngOnInit() {
    if(this.auth.getCurrentUser()){
      this.auth.getCurrentUser().subscribe((user)=>{
        if (user) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
        this.cdr.markForCheck();
      });
    };

    if(this.auth.getCurrentUser()){
      this.auth.getCurrentUser().subscribe((user)=>{
        if (user) {
          let words: string[] = [user.firstName!, user.lastName!]
          this.initials =  words.map(s => s[0]).join('').toUpperCase();
        } else {
          this.initials = '';
        }
        this.cdr.markForCheck();
      });
    };
  }

  onLogout() {
    this.auth.logout();
  }
}
