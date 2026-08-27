import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SingleCategoryComponent } from './single-category.component';
import { CategoriesService } from '../../services/categories.service';
import { PostsService } from '../../services/posts.service';

describe('SingleCategoryComponent', () => {
  let component: SingleCategoryComponent;
  let fixture: ComponentFixture<SingleCategoryComponent>;

  beforeEach(async () => {
    const routeStub: Partial<ActivatedRoute> = {
      paramMap: of(convertToParamMap({ name: 'firebase' })),
    };
    const serviceStub: Partial<CategoriesService> = {
      getByName: () => of({ id: 1, name: 'Firebase', description: 'Demo' }),
    };

    await TestBed.configureTestingModule({
      declarations: [SingleCategoryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: CategoriesService, useValue: serviceStub },
        {
          provide: PostsService,
          useValue: {
            listByCategory: () => of({ content: [] }),
            mapPostsPage: () => ({ posts: [], hasMore: false }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
