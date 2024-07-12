import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWithIconOnSideComponent } from './card-with-icon-on-side.component';

describe('CardWithIconOnSideComponent', () => {
  let component: CardWithIconOnSideComponent;
  let fixture: ComponentFixture<CardWithIconOnSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWithIconOnSideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardWithIconOnSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
