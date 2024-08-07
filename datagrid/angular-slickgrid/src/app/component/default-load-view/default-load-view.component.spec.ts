import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultLoadViewComponent } from './default-load-view.component';

describe('DefaultLoadViewComponent', () => {
  let component: DefaultLoadViewComponent;
  let fixture: ComponentFixture<DefaultLoadViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultLoadViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefaultLoadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
