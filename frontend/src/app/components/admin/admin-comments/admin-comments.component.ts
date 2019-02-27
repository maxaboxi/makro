import { Component, OnInit } from '@angular/core';
import { Comment } from '../../../models/Comment';
import { AdminService } from '../../../services/admin.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-admin-comments',
  templateUrl: './admin-comments.component.html',
  styleUrls: ['./admin-comments.component.css']
})
export class AdminCommentsComponent implements OnInit {
  comments: Comment[];
  propertiesToShow = [
    { name: 'username', date: false },
    { name: 'createdAt', date: true },
    { name: 'comment', date: false },
    { name: 'origPost', date: false }
  ];
  deletedComments = [];
  commentsDeleted = false;

  constructor(
    private adminService: AdminService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    this.adminService.getAllComments().subscribe(comments => (this.comments = comments));
  }

  deleteComment(index) {
    this.deletedComments.push(this.comments[index].uuid);
    this.comments.splice(index, 1);
    this.commentsDeleted = true;
  }

  deleteCommentsFromDb() {
    this.commentService.removeComments(this.deletedComments).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.adminService.getAllComments().subscribe(comments => (this.comments = comments));
          this.commentsDeleted = false;
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
