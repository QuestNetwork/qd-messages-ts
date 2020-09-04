import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelSidebarRightComponent } from './channel-sidebar-right.component';

describe('ChannelSidebarRightComponent', () => {
  let component: ChannelSidebarRightComponent;
  let fixture: ComponentFixture<ChannelSidebarRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelSidebarRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelSidebarRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
