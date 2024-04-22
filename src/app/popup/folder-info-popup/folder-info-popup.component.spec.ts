import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderInfoPopupComponent } from './folder-info-popup.component';

describe('FolderInfoPopupComponent', () => {
  let component: FolderInfoPopupComponent;
  let fixture: ComponentFixture<FolderInfoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderInfoPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
