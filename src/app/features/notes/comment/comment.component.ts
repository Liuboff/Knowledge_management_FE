import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

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
  @Output() deleteCommentEvent = new EventEmitter<string>();

  author!: User;
  isAuthor: boolean = false;
  currentUserId!: string;

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.id) this.currentUserId = user.id;
    });

    if (this.comment && this.comment.authorId && this.currentUserId === this.comment.authorId) {
      this.isAuthor = true;
    }

    if (this.comment && this.comment.authorId) {
      this.authService.getUserInfo(this.comment.authorId).subscribe(author => {
        this.author = author;
      });
    }
  }

  onDeleteComment(idComment: string) {
    this.deleteCommentEvent.emit(idComment);
  }

}
