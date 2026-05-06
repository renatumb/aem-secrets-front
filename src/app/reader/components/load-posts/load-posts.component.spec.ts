import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPostsComponent } from './load-posts.component';

describe('LoadPostsComponent', () => {
  let component: LoadPostsComponent;
  let fixture: ComponentFixture<LoadPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
