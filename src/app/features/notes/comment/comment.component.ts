import { Component, Input, OnInit } from '@angular/core';

import { Comment } from '@shared/models/comment.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth.service';
import { NotesService } from '@shared/services/notes.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  constructor(private authService: AuthService, private notesServise: NotesService ) {}
  @Input() comment!: Comment;

  author!: User;
  isAuthor: boolean = true;
  currentUserId!: string;

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.id) this.currentUserId = user.id;
    });

    if (this.currentUserId === this.comment.authorId) {
      this.isAuthor = true;
    }

    if (this.comment.authorId) {
      this.authService.getUserInfo(this.comment.authorId).subscribe(author => {
        this.author = author;
      });
    }

  }

  onDeleteComment(id: string) {
    this.notesServise.deleteComment(id);
    console.log('delete comment');
  }

}
