import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatMenuComponent } from './mat-menu.component';

describe('MatMenuComponent', () => {
  let component: MatMenuComponent;
  let fixture: ComponentFixture<MatMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
