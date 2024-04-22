import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareFolderPopupComponent } from './share-folder-popup.component';

describe('ShareFolderPopupComponent', () => {
  let component: ShareFolderPopupComponent;
  let fixture: ComponentFixture<ShareFolderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareFolderPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareFolderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
