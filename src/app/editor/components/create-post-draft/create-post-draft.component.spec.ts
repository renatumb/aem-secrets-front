import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreatePostDraftComponent } from './create-post-draft.component';
import { PostsService } from '../../services/posts.service';

describe('CreatePostDraftComponent', () => {
  let component: CreatePostDraftComponent;
  let fixture: ComponentFixture<CreatePostDraftComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CreatePostDraftComponent],
      providers: [
        {
          provide: PostsService,
          useValue: {
            createDraft: () => of({ id: 'new-post-id' }),
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

  it('should redirect to edit with the new post id', () => {
    expect(router.navigate).toHaveBeenCalledWith(
      ['/editor/posts/edit'],
      {
        queryParams: { id: 'new-post-id' },
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

    expect(component.error).toBe('Server error');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
