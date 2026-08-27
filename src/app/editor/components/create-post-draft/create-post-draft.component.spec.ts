import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreatePostDraftComponent } from './create-post-draft.component';
import { PostsService } from '../../services/posts.service';

describe('CreatePostDraftComponent', () => {
  let component: CreatePostDraftComponent;
  let fixture: ComponentFixture<CreatePostDraftComponent>;
  let router: jasmine.SpyObj<Router>;

  const mockDraftPost = {
    id: 'new-post-id',
    title: '',
    permalink: '',
    description: '',
    thumbnail: '',
    content_en: '',
    creation_date: '2026-01-01T10:00:00Z',
    last_modification_date: '2026-01-01T10:00:00Z',
    highlight: false,
    tags: [],
    categories: [],
    author: '',
    comments: [],
    user_id: '',
    statusPost: 'DRAFT',
  };

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CreatePostDraftComponent],
      providers: [
        {
          provide: PostsService,
          useValue: {
            createDraft: () => of(mockDraftPost),
          },
        },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to edit with the new post id and router state', () => {
    expect(router.navigate).toHaveBeenCalledWith(
      ['/editor/posts/edit'],
      {
        queryParams: { id: 'new-post-id' },
        state: { post: mockDraftPost },
        replaceUrl: true,
      },
    );
  });

  it('should show an error when draft creation fails', () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      declarations: [CreatePostDraftComponent],
      providers: [
        {
          provide: PostsService,
          useValue: {
            createDraft: () => throwError(() => ({ message: 'Server error' })),
          },
        },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toBe('Could not create draft post.');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
