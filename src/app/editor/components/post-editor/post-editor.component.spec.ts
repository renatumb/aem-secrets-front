import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { convertToParamMap } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
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
  creationDate: '2026-01-01T10:00:00Z',
  lastModificationDate: '2026-01-02T10:00:00Z',
  highlight: false,
  tags: [],
  categories: [],
  author: 'Author',
  comment: [],
  statusPost: PostStatus.DRAFT,
};

describe('PostEditorComponent', () => {
  let component: PostEditorComponent;
  let fixture: ComponentFixture<PostEditorComponent>;
  let postsService: jasmine.SpyObj<PostsService>;

  beforeEach(async () => {
    history.replaceState({ post: mockPost }, '');
    postsService = jasmine.createSpyObj('PostsService', [
      'uploadImage',
      'resolveUploadedImageUrl',
      'update',
      'getById',
    ]);
    postsService.uploadImage.and.returnValue(
      of({ imageUrl: '94c089fb-567e-480a-921d-c19842ed5441\\bike1.jpg' }),
    );
    postsService.resolveUploadedImageUrl.and.callFake((imageUrl: string) => imageUrl);
    postsService.update.and.returnValue(of(mockPost));
    postsService.getById.and.returnValue(of(mockPost));

    await TestBed.configureTestingModule({
      declarations: [PostEditorComponent],
      imports: [HttpClientTestingModule, FormsModule, AngularEditorModule],
      providers: [
        {
          provide: CategoriesService,
          useValue: { list: () => of({ content: [] }) },
        },
        { provide: PostsService, useValue: postsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ id: mockPost.id }),
            },
          },
        },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      ],
    }).compileComponents();

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
    expect(postsService.getById).not.toHaveBeenCalled();
  });

  it('should call update on save', () => {
    component.onSave();
    expect(postsService.update).toHaveBeenCalled();
  });
});

describe('PostEditorComponent without router state', () => {
  let component: PostEditorComponent;
  let fixture: ComponentFixture<PostEditorComponent>;
  let postsService: jasmine.SpyObj<PostsService>;

  beforeEach(async () => {
    history.replaceState({}, '');
    postsService = jasmine.createSpyObj('PostsService', [
      'resolveUploadedImageUrl',
      'getById',
    ]);
    postsService.resolveUploadedImageUrl.and.callFake((imageUrl: string) => imageUrl);
    postsService.getById.and.returnValue(of(mockPost));

    await TestBed.configureTestingModule({
      declarations: [PostEditorComponent],
      imports: [HttpClientTestingModule, FormsModule, AngularEditorModule],
      providers: [
        {
          provide: CategoriesService,
          useValue: { list: () => of({ content: [] }) },
        },
        { provide: PostsService, useValue: postsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ id: mockPost.id }),
            },
          },
        },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load post by id when history state is missing', () => {
    expect(postsService.getById).toHaveBeenCalledWith(mockPost.id);
    expect(component.editingPost).toEqual(mockPost);
    expect(component.formPostTitle).toBe('Test post');
    expect(component.postLoadError).toBeNull();
  });
});

describe('PostEditorComponent when getById fails', () => {
  let component: PostEditorComponent;
  let fixture: ComponentFixture<PostEditorComponent>;

  beforeEach(async () => {
    history.replaceState({}, '');

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
            resolveUploadedImageUrl: (imageUrl: string) => imageUrl,
            getById: () => throwError(() => ({ message: 'Not found' })),
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
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show load error when getById fails', () => {
    expect(component.postLoadError).toBeTruthy();
    expect(component.postLoading).toBeFalse();
  });
});
