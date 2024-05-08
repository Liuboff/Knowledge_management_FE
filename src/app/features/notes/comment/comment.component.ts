import { Component, Input, OnInit } from '@angular/core';

import { Comment } from '@shared/models/comment.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  constructor(private authService: AuthService) {}
  @Input() comment!: Comment;

  author$!: Observable<User>;

  ngOnInit() {
    if (this.comment.authorId) {
      this.author$ = this.authService.getUserInfo(this.comment.authorId);
    }
  }

}
