import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { PostListComponent } from './post-list.component';
import { PostsService } from '../../services/posts.service';
import { PostStatus } from '../../../shared/models/post.model';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;

  const mockPosts = {
    content: [
      {
        id: 'post-1',
        title: 'Test post',
        permalink: 'test-post',
        description: 'Desc',
        thumbnail: '',
        content_en: '',
        creation_date: '2026-01-01T10:00:00Z',
        last_modification_date: '2026-01-02T10:00:00Z',
        highlight: false,
        tags: [],
        categories: [{ id: 1, name: 'Angular', description: '' }],
        author: 'Author',
        comments: [],
        user_id: 'user-1',
        status_post: PostStatus.DRAFT,
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostListComponent],
      imports: [RouterTestingModule, FormsModule],
      providers: [
        {
          provide: PostsService,
          useValue: {
            list: () => of(mockPosts),
            updateStatus: () => of(mockPosts.content[0]),
            updateHighlight: () => of({ ...mockPosts.content[0], highlight: true }),
            remove: () => of(void 0),
            resolveUploadedImageUrl: (url: string) => url,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts from the service', () => {
    expect(component.posts.length).toBe(1);
    expect(component.posts[0].title).toBe('Test post');
  });
});
