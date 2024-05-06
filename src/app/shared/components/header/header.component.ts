import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthService, private cdr: ChangeDetectorRef) {}

  isLoggedIn: boolean = false;

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
  }

  onLogout() {
    this.auth.logout();
  }
}
