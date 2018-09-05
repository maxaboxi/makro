import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) {}

  ngOnInit() {}

  logout() {
    localStorage.removeItem('token');
    this.auth.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    if (
      confirm(
        'Oletko varma, että haluat poistaa käyttäjätilisi? Tilin mukana poistetaan myös kaikki tallentamasi tieto paitsi lisäämäsi ruoat. Tilin poistoa ei voi perua.'
      )
    ) {
      this.auth.deleteAccount().subscribe(
        success => {
          this.flashMessage.show('Tili poistettu.', {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.logout();
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
}
