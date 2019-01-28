import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  online;
  constructor(private connectionService: ConnectionService) {}

  ngOnInit() {
    this.connectionService.monitor().subscribe(res => (this.online = res));
  }
}
