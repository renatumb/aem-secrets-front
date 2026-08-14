import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpEvent, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject, takeUntil, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {CategoriesService} from '../../services/categories.service';
import {PostsService} from '../../services/posts.service';
import {Category} from '../../../shared/models/category.model';
import {Post, UploadPostImageResponse} from '../../../shared/models/post.model';
import {toUserMessage} from '../../../shared/http/user-facing-error';
import {AngularEditorConfig, UploadResponse} from '@kolkov/angular-editor';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.css',
})
export class PostEditorComponent implements OnInit, OnDestroy {

  /* FORM FIELDS -- */
  formPostId: string | null = null;
  formPostTitle: string | null = null;
  formPermalinkSlug: string | null = null;
  formExcerpt: string | null = null;
  formCategoryId: number[] = [];
  formTagsText : string = '';
  formImagePreview: string | null  = null;
  formContent: string | null = null;
  /* FORM FIELDS -- */

  editingPost!: Post; /* Post being edited */
  editorConfig!: AngularEditorConfig; /* Editor config */
  /* -- */
  categoryOptions: Category[] = [];
  errorCategory: string | null = null;

  selectedImageLabel = 'No file chosen';

  imageUploading = false;
  imageUploadError: string | null = null;
  imagePlaceHolder : string = 'https://placehold.co/600x400';

  contentUploadError: string | null = null;
  postLoading = false;
  postLoadError: string | null = null;
  saving = false;
  saveError: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly postsService: PostsService,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.editorConfig = this.buildEditorConfig();
    this.resolveEditingPost();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTitleChange(value: string): void {
    this.formPostTitle = value;
    this.formPermalinkSlug = this.slugify(value) || 'post-title';
  }

  onImageFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      this.selectedImageLabel = 'No file chosen';
      return;
    }

    if (!this.formPostId) {
      this.imageUploadError = 'Post id is missing. Open the editor with ?id= in the URL.';
      return;
    }

    this.selectedImageLabel = file.name;
    this.imageUploadError = null;
    this.imageUploading = true;

    this.postsService
      .uploadImage(this.formPostId, file, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: UploadPostImageResponse) => {
          this.imageUploading = false;
          if (response?.imageUrl) {
            this.formImagePreview = this.postsService.resolveUploadedImageUrl(response.imageUrl);
            if (this.editingPost) {
              this.editingPost.thumbnail = response.imageUrl;
            }
          }
        },
        error: (err) => {
          this.imageUploading = false;
          this.imageUploadError = toUserMessage(err, 'Image upload failed ');
          console.error('Image upload failed.', err);
        },
      });
  }

  onSave(): void {
    if (!this.formPostId || !this.editingPost) {
      this.saveError = 'Post id is missing. Open the editor with ?id= in the URL.';
      return;
    }

    if (this.saving) {
      return;
    }

    const payload: Post = this.buildPostPayload();

    this.saving = true;
    this.saveError = null;

    this.postsService
      .update(this.formPostId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.saving = false;
          this.applyPost(updated);
          alert("Saved **")
        },
        error: (err) => {
          this.saving = false;
          this.saveError = toUserMessage(err, 'Could not save post ');
          console.error('Could not save post.', err);
        },
      });
  }

  private buildPostPayload(): Post {
    const categories =
      this.formCategoryId.map((categoryId) => {
        const existing = this.editingPost.categories?.find(
          (category) => category.id === categoryId,
        );

        const fromOptions = this.categoryOptions.find(
          (category) => category.id === categoryId,
        );

        return existing ?? fromOptions ?? {
          id: categoryId,
          name: '',
          description: '',
        };
      });

    return {
      ...this.editingPost,
      title: this.formPostTitle ?? this.editingPost.title,
      permalink: this.formPermalinkSlug ?? this.editingPost.permalink,
      description: this.formExcerpt ?? this.editingPost.description,
      content_en: this.formContent ?? this.editingPost.content_en,
      categories,
      tags: this.parseTags(this.formTagsText),
    };
  }

  private parseTags(raw: string): string[] {
    const seen = new Set<string>();

    return raw
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => {
        if (!tag) {
          return false;
        }

        const key = tag.toLowerCase();
        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
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
    if (!this.formPostId) {
      this.contentUploadError = 'Post id is missing. Open the editor with ?id= in the URL.';
      return throwError(() => new Error('Post id is missing.'));
    }

    this.contentUploadError = null;

    const uploadRequest$ = this.postsService.uploadImage(this.formPostId, file);

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
        const errorMessage = toUserMessage(err, 'Image upload failed ');
        this.contentUploadError = errorMessage;
        alert(errorMessage);
        console.error('Editor image upload failed.', err);
        return throwError(() => err);
      }),
    );

    return uploadResult$;
  }

  private resolveEditingPost(): void {
    const idFromRoute = this.route.snapshot.queryParamMap.get('id');
    const statePost = history.state?.['post'] as Post | undefined;

    this.formPostId = idFromRoute;
    this.postLoadError = null;

    if (statePost?.id && (!idFromRoute || statePost.id === idFromRoute)) {
      this.applyPost(statePost);
      return;
    }

    if (idFromRoute) {
      this.loadPostById(idFromRoute);
      return;
    }

    this.postLoadError = 'Post id is missing. Open the editor with ?id= in the URL.';
  }

  private loadPostById(id: string): void {
    this.postLoading = true;
    this.postLoadError = null;

    this.postsService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (post) => {
          this.postLoading = false;
          this.applyPost(post);
        },
        error: (err) => {
          this.postLoading = false;
          this.postLoadError = toUserMessage(err, 'Could not load post. Open this post from the post list ',);
          console.error('Could not load post by id ', err);
        },
      });
  }

  private applyPost(post: Post): void {
    this.editingPost = post;
    /**/
    this.formPostId = post.id;
    this.formPostTitle = post.title
    this.formPermalinkSlug = post.permalink ;
    this.formExcerpt = post.description;
    this.formCategoryId = post.categories?.map((category) => category.id) ?? [];
    this.formTagsText = post.tags?.join(', ') ?? '';

    if (post.thumbnail) {
      this.formImagePreview = this.postsService.resolveUploadedImageUrl(post.thumbnail);
    }

    this.formContent = post.content_en;
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
        next: (items) => this.categoryOptions = items?.content ? [...items?.content] : [],
        error: (err) => {
          this.errorCategory = toUserMessage(err, 'Could not load categories ');
          console.error('Could not load categories.', err);
        },
      });
  }
}
