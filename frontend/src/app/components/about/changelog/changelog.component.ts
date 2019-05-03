import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent implements OnInit {
  showOlderUpdates = false;

  constructor() {}

  ngOnInit() {}

  toggleShowOlderUpdates() {
    this.showOlderUpdates = !this.showOlderUpdates;
  }
}
