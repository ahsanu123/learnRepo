import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsemirrorBasicEditorComponent } from './prosemirror-basic-editor.component';

describe('ProsemirrorBasicEditorComponent', () => {
  let component: ProsemirrorBasicEditorComponent;
  let fixture: ComponentFixture<ProsemirrorBasicEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProsemirrorBasicEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProsemirrorBasicEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
