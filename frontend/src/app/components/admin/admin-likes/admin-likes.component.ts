import { Component, OnInit } from '@angular/core';
import { Like } from '../../../models/Like';
import { AdminService } from '../../../services/admin.service';
import { LikeService } from '../../../services/like.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-admin-likes',
  templateUrl: './admin-likes.component.html',
  styleUrls: ['./admin-likes.component.css']
})
export class AdminLikesComponent implements OnInit {
  likes: Like[];
  propertiesToShow = [
    { name: 'username', date: false },
    { name: 'createdAt', date: true },
    { name: 'likedContent', date: false },
    { name: 'value', date: false }
  ];
  deletedVotes = [];
  likesDeleted = false;

  constructor(
    private adminService: AdminService,
    private voteService: LikeService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.adminService.getAllLikes().subscribe(likes => (this.likes = likes));
  }

  deleteVote(index) {
    this.deletedVotes.push({ ...this.likes[index] });
    this.likes.splice(index, 1);
    this.likesDeleted = true;
  }

  deleteVotesFromDb() {
    this.voteService.removeLikes(this.deletedVotes).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.adminService.getAllLikes().subscribe(likes => (this.likes = likes));
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
