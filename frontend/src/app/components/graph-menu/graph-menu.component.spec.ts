import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMenuComponent } from './graph-menu.component';

describe('GraphMenuComponent', () => {
  let component: GraphMenuComponent;
  let fixture: ComponentFixture<GraphMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
