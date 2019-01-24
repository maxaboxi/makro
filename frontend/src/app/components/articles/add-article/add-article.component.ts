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
    tags: []
  };
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageBlob: Blob = undefined;
  showCropper = false;
  uploadingImage = false;

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
    if (this.queryParams['_id']) {
      this.editing = true;
      this.articleService.getArticleById(this.queryParams['_id']).subscribe(
        article => {
          this.article._id = this.queryParams['_id'];
          this.article.title = article[0].title;
          this.article.origTitle = article[0].title;
          this.article.body = article[0].body;
          this.article.origBody = article[0].body;
          this.article.headerImgId = article[0].headerImgId;
          this.article.tags = article[0].tags;

          if (this.article.headerImgId) {
            this.articleService.getImageForArticle(this.article.headerImgId).subscribe(res => {
              if (res) {
                this.createImageFromBlob(res);
              }
            });
          }
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
    this.uploadingImage = true;
    const file = new File([this.imageBlob], 'headerImage', {
      type: this.imageBlob.type,
      lastModified: Date.now()
    });

    this.articleService.addImageToArticle(file).subscribe(response => {
      this.uploadingImage = false;
      if (response['success']) {
        if (this.image) {
          this.oldImages.push(this.image);
        }
        this.image = response['file'];
        this.showCropper = false;
        this.fileError = '';
      }
    });

    // this.articleService.scanFile(file).subscribe(res => {
    //   if (res['success'] && res['clean']) {
    //     this.articleService.addImageToArticle(file).subscribe(response => {
    //       this.uploadingImage = false;
    //       if (response['success']) {
    //         if (this.image) {
    //           this.oldImages.push(this.image);
    //         }
    //         this.image = response['file'];
    //         this.showCropper = false;
    //         this.fileError = '';
    //       }
    //     });
    //   } else if (res['success'] && !res['clean']) {
    //     this.fileError = 'Kuva ei läpäissyt virustarkistusta.';
    //   } else {
    //     this.fileError = 'Virhe kuvaa tallennettaessa.';
    //   }
    // });
  }

  addArticle() {
    if (this.image) {
      this.article.headerImgId = this.image;
    }
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

    if (this.oldImages.length > 0) {
      this.articleService.deleteArticleImages(this.oldImages).subscribe(() => (this.oldImages = []));
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
