import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { convertToParamMap } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { PostEditorComponent } from './post-editor.component';
import { CategoriesService } from '../../services/categories.service';
import { PostsService } from '../../services/posts.service';
import { PostStatus } from '../../../shared/models/post.model';

const mockPost = {
  id: '94c089fb-567e-480a-921d-c19842ed5441',
  title: 'Test post',
  permalink: 'test-post',
  description: 'Excerpt text',
  thumbnail: '',
  content_en: '<p>Body</p>',
  creation_date: '2026-01-01T10:00:00Z',
  last_modification_date: '2026-01-02T10:00:00Z',
  highlight: false,
  tags: [],
  categories: [],
  author: 'Author',
  comments: [],
  user_id: 'user-1',
  statusPost: PostStatus.DRAFT,
};

describe('PostEditorComponent', () => {
  let component: PostEditorComponent;
  let fixture: ComponentFixture<PostEditorComponent>;

  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    history.replaceState({ post: mockPost }, '');
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PostEditorComponent],
      imports: [HttpClientTestingModule, FormsModule, AngularEditorModule],
      providers: [
        {
          provide: CategoriesService,
          useValue: { list: () => of({ content: [] }) },
        },
        {
          provide: PostsService,
          useValue: {
            uploadImage: () => of({ imageUrl: '94c089fb-567e-480a-921d-c19842ed5441\\bike1.jpg' }),
            resolveUploadedImageUrl: (imageUrl: string) => imageUrl,
            update: () => of(mockPost),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ id: mockPost.id }),
            },
          },
        },
        { provide: Router, useValue: router },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate editingPost from router state', () => {
    expect(component.editingPost).toEqual(mockPost);
    expect(component.formPostTitle).toBe('Test post');
    expect(component.formExcerpt).toBe('Excerpt text');
    expect(component.formContent).toBe('<p>Body</p>');
  });

  it('should call update and navigate on save', () => {
    component.onSave();
    expect(router.navigate).toHaveBeenCalledWith(['/editor/posts']);
  });
});
