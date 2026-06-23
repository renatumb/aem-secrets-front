import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpEvent, HttpResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subject, takeUntil, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {CategoriesService} from '../../services/categories.service';
import {PostsService} from '../../services/posts.service';
import {Category} from '../../../shared/models/category.model';
import {UploadPostImageResponse} from '../../../shared/models/post.model';
import {AngularEditorConfig, UploadResponse} from '@kolkov/angular-editor';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.css',
})
export class PostEditorComponent implements OnInit, OnDestroy {
  postTitle = '';
  excerpt =
    'A short summary that appears in listings and SEO snippets. Keep it concise and inviting so readers know what to expect.';
  content = '';
  categoryId = '';

  categoryOptions: Category[] = [];
  errorCategory: null | any = null;

  /** Shown in the permalink field; derived from the title for a classic CMS feel. */
  permalinkSlug = 'post-title';

  imagePreview: string = 'https://placehold.co/600x400';

  selectedImageLabel = 'No file chosen';
  imageUploading = false;
  imageUploadError: string | null = null;
  contentUploadError: string | null = null;

  /** Post id from route query (?id=...) — required by the image upload endpoint. */
  postId: string | null = null;

  editorConfig!: AngularEditorConfig;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly postsService: PostsService,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.editorConfig = this.buildEditorConfig();
    this.loadCategories();

    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.postId = params.get('id');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTitleChange(value: string): void {
    this.postTitle = value;
    this.permalinkSlug = this.slugify(value) || 'post-title';
  }

  onImageFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      this.selectedImageLabel = 'No file chosen';
      return;
    }

    if (!this.postId) {
      this.imageUploadError = 'Post id is missing. Open the editor with ?id= in the URL.';
      return;
    }

    this.selectedImageLabel = file.name;
    this.imageUploadError = null;
    this.imageUploading = true;

    this.postsService
      .uploadImage(this.postId, file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: UploadPostImageResponse) => {
          this.imageUploading = false;
          if (response?.imageUrl) {
            this.imagePreview = this.postsService.resolveUploadedImageUrl(response.imageUrl);
          }
        },
        error: (err) => {
          this.imageUploading = false;
          this.imageUploadError = err?.error?.message ?? err?.message ?? 'Image upload failed.';
          console.error('Image upload failed.', err);
        },
      });
  }

  private buildEditorConfig(): AngularEditorConfig {
    return {
      editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '18rem',
      placeholder: 'Write the full post body here…',
      upload: (file: File) => this.uploadEditorImage(file),
    };
  }

  private uploadEditorImage(file: File): Observable<HttpEvent<UploadResponse>> {
    if (!this.postId) {
      this.contentUploadError = 'Post id is missing. Open the editor with ?id= in the URL.';
      return throwError(() => new Error('Post id is missing.'));
    }

    this.contentUploadError = null;

    const postId = this.postId;
    const uploadRequest$ = this.postsService.uploadImage(postId, file);

    const uploadResult$ = uploadRequest$.pipe(
      map((backendResponse) => {
        const backendImagePath = backendResponse.imageUrl;
        const resolvedImageUrl = this.postsService.resolveUploadedImageUrl(backendImagePath);

        const uploadResponseBody: UploadResponse = {
          imageUrl: resolvedImageUrl,
        };

        const httpResponse = new HttpResponse<UploadResponse>({
          body: uploadResponseBody,
          status: 200,
        });

        return httpResponse;
      }),
      catchError((err) => {
        const errorMessage = err?.error?.message ?? err?.message ?? 'Image upload failed.';
        this.contentUploadError = errorMessage;
        alert(errorMessage);
        console.error('Editor image upload failed.', err);
        return throwError(() => err);
      }),
    );

    return uploadResult$;
  }

  private slugify(raw: string): string {
    return raw
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  private loadCategories(): void {
    this.errorCategory = null;
    this.categoriesService
      .list()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => this.categoryOptions = items?.content ? [{id: '', name: 'Please select a category '}, ...items?.content] : [],
        error: (err) => {
          this.errorCategory = err;
          console.error('Could not load categories.');
          console.error(JSON.stringify(err));
        },
      });
  }
}
