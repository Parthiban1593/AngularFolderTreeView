import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalvoViewPopupComponent } from './salvo-view-popup.component';

describe('SalvoViewPopupComponent', () => {
  let component: SalvoViewPopupComponent;
  let fixture: ComponentFixture<SalvoViewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalvoViewPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalvoViewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
