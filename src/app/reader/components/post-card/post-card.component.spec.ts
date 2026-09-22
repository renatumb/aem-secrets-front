import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PostCardComponent } from './post-card.component';
import { PostsService } from '../../services/posts.service';
import { Post, PostStatus } from '../../../shared/models/post.model';
import { AccessLevel } from '../../../shared/models/user.model';

const mockPost: Post = {
  id: 'post-1',
  permalink: 'test-post',
  title: 'Test post',
  description: 'Excerpt',
  thumbnail: '',
  content_en: '<p>Body</p>',
  creationDate: '2026-01-01T10:00:00Z',
  lastModificationDate: '2026-01-02T10:00:00Z',
  highlight: false,
  tags: ['tag'],
  categories: [],
  author: {
    id: 'user-1',
    name: 'Author',
    email: 'author@mail.com',
    accessLevel: AccessLevel.CAN_WRITE,
    accountLocked: false,
  },
  comment: [],
  statusPost: PostStatus.PUBLISHED,
};

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostCardComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: PostsService,
          useValue: { resolveThumbnailUrl: (url: string) => url },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
    component.post = mockPost;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
