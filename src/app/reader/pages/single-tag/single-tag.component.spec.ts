import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SingleTagComponent } from './single-tag.component';
import { PostsService } from '../../services/posts.service';

describe('SingleTagComponent', () => {
  let component: SingleTagComponent;
  let fixture: ComponentFixture<SingleTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleTagComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ name: 'angular' })),
          },
        },
        {
          provide: PostsService,
          useValue: {
            listByTag: () => of({ content: [] }),
            mapPostsPage: () => ({ posts: [], hasMore: false }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve tag name from route', () => {
    expect(component.tagName).toBe('angular');
  });
});
