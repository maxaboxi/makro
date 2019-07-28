import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogComponent } from './changelog.component';
import { MockTranslatePipe } from 'src/app/test-helpers/MockTranslatePipe';

describe('ChangelogComponent', () => {
  let component: ChangelogComponent;
  let fixture: ComponentFixture<ChangelogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangelogComponent, MockTranslatePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show older updates', () => {
    // Assert
    expect(component.showOlderUpdates).toBeFalsy();
  });

  it('should set showOlderUpdates to true', () => {
    // Arrange
    component.showOlderUpdates = true;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.showOlderUpdates).toBeTruthy();
  });
});
