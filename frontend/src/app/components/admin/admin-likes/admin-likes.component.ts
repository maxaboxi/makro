import { Component, OnInit, OnDestroy } from '@angular/core';
import { Like } from '../../../models/Like';
import { AdminService } from '../../../services/admin.service';
import { LikeService } from '../../../services/like.service';
import { TranslateService } from '@ngx-translate/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-likes',
  templateUrl: './admin-likes.component.html',
  styleUrls: ['./admin-likes.component.css']
})
export class AdminLikesComponent implements OnInit, OnDestroy {
  likes: Like[] = [];
  propertiesToShow = [
    { name: 'username', date: false },
    { name: 'createdAt', date: true },
    { name: 'likedContent', date: false },
    { name: 'value', date: false }
  ];
  deletedVotes = [];
  likesDeleted = false;

  private subscriptions = new Subscription();

  constructor(
    private adminService: AdminService,
    private likeService: LikeService,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.subscriptions.add(this.adminService.getAllLikes().subscribe(likes => (this.likes = likes)));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  deleteVote(index: number) {
    this.deletedVotes.push(this.likes[index].uuid);
    this.likes.splice(index, 1);
    this.likesDeleted = true;
  }

  deleteVotesFromDb() {
    this.subscriptions.add(
      this.likeService.removeLikes(this.deletedVotes).subscribe(
        res => {
          if (res['success']) {
            this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
              cssClass: 'alert-success',
              timeout: 2000
            });
            this.subscriptions.add(this.adminService.getAllLikes().subscribe(likes => (this.likes = likes)));
            this.likesDeleted = false;
          }
        },
        (error: Error) => {
          this.flashMessage.show(error['error'].msg, {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      )
    );
  }
}
