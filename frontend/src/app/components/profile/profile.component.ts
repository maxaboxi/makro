import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  online: boolean;
  private subscriptions = new Subscription();

  constructor(private connectionService: ConnectionService) {}

  ngOnInit() {
    this.subscriptions.add(this.connectionService.monitor().subscribe(res => (this.online = res)));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
