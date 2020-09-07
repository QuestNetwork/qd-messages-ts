import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelSidebarLeftComponent } from './channel-sidebar-left.component';

describe('ChannelSidebarLeftComponent', () => {
  let component: ChannelSidebarLeftComponent;
  let fixture: ComponentFixture<ChannelSidebarLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelSidebarLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelSidebarLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
