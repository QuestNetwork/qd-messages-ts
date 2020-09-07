import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelParticipantListComponent } from './channel-participant-list.component';

describe('ChannelParticipantListComponent', () => {
  let component: ChannelParticipantListComponent;
  let fixture: ComponentFixture<ChannelParticipantListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelParticipantListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelParticipantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
