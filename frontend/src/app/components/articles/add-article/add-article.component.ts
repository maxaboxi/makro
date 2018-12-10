import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/User';
import { Article } from '../../../models/Article';
import { ActivatedRoute } from '@angular/router';

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
  oldImages = [];
  article: Article = {
    title: '',
    body: '',
    tags: []
  };

  constructor(
    private articleService: ArticleService,
    private auth: AuthService,
    private route: ActivatedRoute
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

  onSelectFile(e) {
    if (e.target.files && e.target.files[0]) {
      const width = 700;
      const fileName = e.target.files[0].name;
      const reader = new FileReader();

      reader.readAsDataURL(e.target.files[0]);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target['result'];

        (img.onload = () => {
          const scaleFactor = width / img.width;
          const height = img.height * scaleFactor;
          const elem = document.createElement('canvas');
          elem.width = width;
          elem.height = height;

          const ctx = elem.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          document.getElementById('croppedImg').innerHTML = '';
          document.getElementById('croppedImg').appendChild(elem);

          ctx.canvas.toBlob(
            blob => {
              const file = new File([blob], fileName, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              this.saveImage(file);
            },
            'image/jpeg',
            1
          );
        }),
          (reader.onerror = error => console.log(error));
      };
    }
  }

  saveImage(file) {
    this.articleService.addImageToArticle(file).subscribe(res => {
      if (res['success']) {
        if (this.image) {
          this.oldImages.push(this.image);
        }
        this.image = res['file'];
      }
    });
  }

  addArticle() {
    if (this.image) {
      this.article.headerImgId = this.image;
    }
    this.article.username = this.user.username;
    console.log(this.article);
    this.articleService
      .addArticle(this.article)
      .subscribe(res => console.log(res));

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
}
