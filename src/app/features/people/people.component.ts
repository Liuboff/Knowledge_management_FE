import { Component } from '@angular/core';

import { User } from '@shared/models/user.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent {
  userList: User[] = []; 
}

