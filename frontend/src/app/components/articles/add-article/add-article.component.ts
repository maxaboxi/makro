import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User';
import { Article } from '../../../models/Article';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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
    private flashMessage: FlashMessagesService
  ) {
    this.route.queryParams.subscribe(qp => {
      Object.keys(qp).forEach(param => {
        this.queryParams[param] = qp[param];
      });
    });
  }

  ngOnInit() {
    this.auth.user.subscribe(user => (this.user = user));
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
    this.fileError =
      'Väärä tiedostotyyppi. Sallitut tiedostotyypit ovat: jpg/jpeg, png, gif.';
  }

  saveImage() {
    this.uploadingImage = true;
    const file = new File([this.imageBlob], 'headerImage', {
      type: this.imageBlob.type,
      lastModified: Date.now()
    });
    this.articleService.addImageToArticle(file).subscribe(res => {
      this.uploadingImage = false;
      if (res['success']) {
        if (this.image) {
          this.oldImages.push(this.image);
        }
        this.image = res['file'];
        this.showCropper = false;
      }
    });
  }

  addArticle() {
    if (this.image) {
      this.article.headerImgId = this.image;
    }
    this.article.username = this.user.username;
    this.articleService.addArticle(this.article).subscribe(
      res => {
        if (res['success']) {
          this.router.navigate(['/articles']);
          this.resetArticle();
          this.flashMessage.show('Artikkeli julkaistu onnistuneesti.', {
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

    if (this.oldImages.length > 0) {
      this.articleService
        .deleteArticleImages(this.oldImages)
        .subscribe(() => (this.oldImages = []));
    }
  }

  addTagToArticle(char) {
    if (this.articleTag.length >= 3 && char === ',') {
      this.article.tags.push(
        this.articleTag.slice(0, this.articleTag.length - 1)
      );
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
}
