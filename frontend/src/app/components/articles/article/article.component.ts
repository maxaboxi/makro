import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '../../../models/Article';
import { User } from '../../../models/User';
import { BehaviorSubject } from 'rxjs';
import { ArticleService } from '../../../services/article.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  private _user = new BehaviorSubject<User>(null);
  private _article = new BehaviorSubject<Article>(null);
  image: Blob;

  @Input()
  set user(user) {
    this._user.next(user);
  }

  get user() {
    return this._user.getValue();
  }

  @Input()
  set article(q) {
    this._article.next(q);
  }

  get article() {
    return this._article.getValue();
  }

  @Output()
  deleted = new EventEmitter();

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private modalService: NgbModal,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    if (this.article.headerImgId) {
      this.articleService
        .getImageForArticle(this.article.headerImgId)
        .subscribe(res => {
          if (res) {
            this.createImageFromBlob(res);
          }
        });
    }
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.image = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  editArticle() {
    this.router.navigate(['/articles/addarticle'], {
      queryParams: { _id: this.article._id }
    });
  }

  openDeleteArticleModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'save') {
          this.articleService.deleteArticle(this.article._id).subscribe(res => {
            this.flashMessage.show(res['msg'], {
              cssClass: res['success'] ? 'alert-success' : 'alert-danger',
              timeout: 2000
            });
            if (res['success']) {
              this.deleted.emit('deleted');
            }
          });
        }
      },
      dismissed => {}
    );
  }
}
