import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LikeService } from '../../../services/like.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../../models/User';
import { Like } from '../../../models/Like';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-likes',
  templateUrl: './user-likes.component.html',
  styleUrls: ['./user-likes.component.css']
})
export class UserLikesComponent implements OnInit {
  user: User;
  likes: Like[] = [];
  deletedLikes = [];
  likesDeleted = false;
  loading = true;

  constructor(
    private auth: AuthService,
    private likeService: LikeService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user.username) {
        this.likeService.getAllUserLikesWithId().subscribe(
          likes => {
            this.likes = likes;
            this.loading = false;
          },
          (error: Error) => {
            this.loading = false;
            this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
              cssClass: 'alert-danger',
              timeout: 2000
            });
          }
        );
      }
    });
  }

  deleteLike(index, like) {
    this.deletedLikes.push(like);
    this.likes.splice(index, 1);
    this.likesDeleted = true;
  }

  deleteLikesFromDb() {
    this.likeService.removeLikes(this.deletedLikes).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.likeService.getAllUserLikesWithId().subscribe(likes => {
            this.likes = likes;
          });
          this.likesDeleted = false;
        }
      },
      (error: Error) => {
        this.flashMessage.show(error['error'].msg, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }
}
