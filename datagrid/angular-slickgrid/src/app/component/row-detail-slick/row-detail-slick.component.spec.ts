import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowDetailSlickComponent } from './row-detail-slick.component';

describe('RowDetailSlickComponent', () => {
  let component: RowDetailSlickComponent;
  let fixture: ComponentFixture<RowDetailSlickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowDetailSlickComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RowDetailSlickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
