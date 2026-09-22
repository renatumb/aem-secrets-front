import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SinglePostComponent } from './single-post.component';
import { PostsService } from '../../services/posts.service';
import { PostStatus } from '../../../shared/models/post.model';
import { AccessLevel } from '../../../shared/models/user.model';
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
          author: {
            id: 'user-1',
            name: 'JOSE WRITE',
            email: 'write@mail.com',
            about: 'about this user',
            photoProfile: 'x2.jpg',
            accessLevel: AccessLevel.CAN_WRITE,
            accountLocked: false,
          },
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
            resolveAuthorPhotoUrl: (path: string) => `/api/user/profilephoto/${path}`,
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

  it('exposes author bio fields from the post author', () => {
    expect(component.authorName).toBe('JOSE WRITE');
    expect(component.authorAbout).toBe('about this user');
    expect(component.authorPhotoUrl).toBe('/api/user/profilephoto/x2.jpg');
    expect(component.hasAuthorBio).toBeTrue();
  });
});
