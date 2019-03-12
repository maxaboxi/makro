import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/User';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[];
  propertiesToShow = [{ name: 'username', date: false }, { name: 'lastLogin', date: true }];
  newUserPassword;
  newUserPasswordAgain;
  selectedUser: User;
  deletedUsers = [];
  usersDeleted = false;

  constructor(
    private adminService: AdminService,
    private flashMessage: FlashMessagesService,
    private modalService: NgbModal,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.adminService.getAllUsers().subscribe(users => (this.users = users));
  }

  openUserModal(content, user) {
    this.adminService.getUser(user.uuid).subscribe(
      user => {
        this.selectedUser = user;
        this.modalService.open(content, { centered: true }).result.then(
          result => {
            if (result === 'save') {
              if (this.newUserPassword && this.newUserPasswordAgain) {
                if (this.newUserPassword !== this.newUserPasswordAgain) {
                  this.flashMessage.show(this.translator.instant('CHANGE_PASSWORDS_DONT_MATCH'), {
                    cssClass: 'alert-danger',
                    timeout: 2000
                  });
                  this.newUserPassword = null;
                  this.newUserPasswordAgain = null;
                } else {
                  const user = {
                    uuid: this.selectedUser.uuid,
                    password: this.newUserPassword
                  };
                  this.adminService.updateUserPassword(user).subscribe(
                    res => {
                      if (res['success']) {
                        this.flashMessage.show(this.translator.instant('USER_PASSWORD_CHANGED'), {
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
              } else {
                this.adminService.updateUserInformation(this.selectedUser).subscribe(
                  res => {
                    if (res['success']) {
                      this.flashMessage.show(this.translator.instant('USER_INFORMATION_UPDATED'), {
                        cssClass: 'alert-success',
                        timeout: 2000
                      });
                      this.adminService.getAllUsers().subscribe(users => (this.users = users));
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
            this.selectedUser = null;
          },
          dismissed => {
            this.selectedUser = null;
          }
        );
      },
      (error: Error) => {
        this.flashMessage.show(this.translator.instant('NETWORK_LOADING_ERROR'), {
          cssClass: 'alert-danger',
          timeout: 2000
        });
      }
    );
  }

  deleteUser(index) {
    this.deletedUsers.push(this.users[index].uuid);
    this.users.splice(index, 1);
    this.usersDeleted = true;
  }

  deleteUsersFromDb() {
    this.adminService.removeUsers(this.deletedUsers).subscribe(
      res => {
        if (res['success']) {
          this.flashMessage.show(this.translator.instant('CHANGES_SAVED'), {
            cssClass: 'alert-success',
            timeout: 2000
          });
          this.deletedUsers = [];
          this.usersDeleted = false;
          this.adminService.getAllUsers().subscribe(users => (this.users = users));
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
