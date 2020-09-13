import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestMessengerJsComponent } from './quest-messenger-js.component';

describe('QuestMessengerJsComponent', () => {
  let component: QuestMessengerJsComponent;
  let fixture: ComponentFixture<QuestMessengerJsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestMessengerJsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestMessengerJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
