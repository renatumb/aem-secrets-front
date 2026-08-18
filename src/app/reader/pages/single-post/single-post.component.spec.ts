import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SinglePostComponent } from './single-post.component';
import { PostsService } from '../../services/posts.service';
import { PostStatus } from '../../../shared/models/post.model';
import { SafeHtmlPipe } from '../../../shared/security/safe-html.pipe';

describe('SinglePostComponent', () => {
  let component: SinglePostComponent;
  let fixture: ComponentFixture<SinglePostComponent>;

  beforeEach(async () => {
    history.replaceState(
      {
        post: {
          id: 'post-1',
          permalink: 'test-post',
          title: 'Test',
          description: '',
          thumbnail: '',
          content_en: '<p>Hi</p>',
          creationDate: '',
          lastModificationDate: '',
          highlight: false,
          tags: [],
          categories: [],
          author: '',
          comment: [],
          statusPost: PostStatus.PUBLISHED,
        },
      },
      '',
    );

    await TestBed.configureTestingModule({
      declarations: [SinglePostComponent],
      imports: [SafeHtmlPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ 'post-id': 'test-post' }),
            },
          },
        },
        {
          provide: PostsService,
          useValue: {
            getBySlug: () => of({}),
            listByTag: () => of({ content: [] }),
            resolveThumbnailUrl: (url: string) => url,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SinglePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
