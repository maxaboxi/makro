import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User';
import { Article } from '../../../models/Article';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {
  user: User;
  editing = false;
  queryParams = {};
  articleTag = '';
  image: String;
  fileError: String;
  oldImages = [];
  article: Article = {
    title: '',
    body: '',
    tags: [],
    images: []
  };
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageBlob: Blob = undefined;
  showCropper = false;

  constructor(
    private articleService: ArticleService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private translator: TranslateService
  ) {
    this.route.queryParams.subscribe(qp => {
      Object.keys(qp).forEach(param => {
        this.queryParams[param] = qp[param];
      });
    });
  }

  ngOnInit() {
    this.auth.user.subscribe(user => (this.user = user));
    if (this.queryParams['uuid']) {
      this.editing = true;
      this.articleService.getArticleById(this.queryParams['uuid']).subscribe(
        article => {
          this.article.uuid = article.uuid;
          this.article.title = article.title;
          this.article.body = article.body;
          this.article.images = article.images;
          this.article.tags = article.tags;
        },
        (error: Error) => {
          this.router.navigate(['/articles']);
        }
      );
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.showCropper = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imageBlob = event.file;
  }

  imageLoaded() {
    this.fileError = undefined;
  }

  loadImageFailed() {
    this.fileError = this.translator.instant('FILE_ERROR_MSG');
  }

  saveImage() {
    const file = new File([this.imageBlob], 'headerImage', {
      type: this.imageBlob.type,
      lastModified: Date.now()
    });
    this.article.images.push(file);
    this.showCropper = false;
  }

  addArticle() {
    this.article.username = this.user.username;
    if (!this.editing) {
      this.articleService.addArticle(this.article).subscribe(
        res => {
          if (res['success']) {
            this.router.navigate(['/articles']);
            this.resetArticle();
            this.flashMessage.show(this.translator.instant('ARTICLE_PUBLISHED'), {
              cssClass: 'alert-success',
              timeout: 2000
            });
          }
        },
        (error: Error) => {
          this.flashMessage.show(error['error'].msg, {
            cssClass: 'alert-danger',
            timeout: 2000
          });
        }
      );
    } else {
      this.articleService.editArticle(this.article).subscribe(
        res => {
          if (res['success']) {
            this.router.navigate(['/articles']);
            this.resetArticle();
            this.flashMessage.show(this.translator.instant('ARTICLE_EDITED'), {
              cssClass: 'alert-success',
              timeout: 2000
            });
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

  addTagToArticle(char) {
    if (this.articleTag.length >= 3 && char === ',') {
      this.article.tags.push(this.articleTag.slice(0, this.articleTag.length - 1));
      this.articleTag = '';
    }
  }

  removeTagFromArticle(index) {
    this.article.tags.splice(index, 1);
  }

  resetArticle() {
    this.article = {
      title: '',
      body: '',
      tags: []
    };
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.croppedImage = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
