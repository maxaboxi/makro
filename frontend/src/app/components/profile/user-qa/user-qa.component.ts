import { Component, OnInit } from '@angular/core';
import { QaService } from '../../../services/qa.service';
import { LikeService } from '../../../services/like.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User';
import { Answer } from '../../../models/Answer';
import { Question } from '../../../models/Question';
import { Like } from '../../../models/Like';
import { Comment } from '../../../models/Comment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { TranslateService } from '@ngx-translate/core';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-user-qa',
  templateUrl: './user-qa.component.html',
  styleUrls: ['./user-qa.component.css']
})
export class UserQaComponent implements OnInit {
  user: User;
  answers: Answer[];
  likes: Like[];
  comments: Comment[];

  constructor(
    private auth: AuthService,
    private qaService: QaService,
    private likeService: LikeService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.qaService.getAllUserAnswersByUser().subscribe(
          answers => {
            this.answers = answers;
          },
          (error: Error) => {
            this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
              cssClass: 'alert-danger',
              timeout: 2000
            });
          }
        );
        this.likeService.getAllUserLikesWithId().subscribe(
          likes => {
            this.likes = likes;
          },
          (error: Error) => {
            this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
              cssClass: 'alert-danger',
              timeout: 2000
            });
          }
        );
        this.commentService.getAllCommentsByUser().subscribe(
          comments => {
            this.comments = comments;
          },
          (error: Error) => {
            this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
              cssClass: 'alert-danger',
              timeout: 2000
            });
          }
        );
      }
    });
  }
}
