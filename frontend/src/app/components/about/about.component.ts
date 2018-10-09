import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  showOlderUpdates = false;

  constructor() {}

  ngOnInit() {}

  toggleShowOlderUpdates() {
    this.showOlderUpdates = !this.showOlderUpdates;
  }
}
