import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { Post, PostStatus } from '../../../shared/models/post.model';
import { PLACEHOLDER_THUMBNAIL } from '../../../shared/placeholder';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  loading = false;
  error: string | null = null;
  busyIds = new Set<string>();

  readonly statusOptions = Object.values(PostStatus);
  readonly placeholderThumbnail = PLACEHOLDER_THUMBNAIL;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly postsService: PostsService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isBusy(post: Post): boolean {
    return this.busyIds.has(post.id);
  }

  thumbnailUrl(post: Post): string {
    if (!post.thumbnail) {
      return this.placeholderThumbnail;
    }
    return this.postsService.resolveUploadedImageUrl(post.thumbnail);
  }

  statusSelectClasses(status: PostStatus): Record<string, boolean> {
    return {
      'border-amber-400      bg-yellow-200  font-bold text-amber-950   focus:border-amber-500   focus:ring-amber-500/25'          : status === PostStatus.DRAFT,
      'border-emerald-500    bg-green-200   font-bold text-emerald-950 focus:border-emerald-600 focus:ring-emerald-600/25'        : status === PostStatus.PUBLISHED,
      'border-red-400        bg-red-200     font-bold text-red-950     focus:border-red-500     focus:ring-red-500/25'            : status === PostStatus.UNPUBLISHED,
    };
  }

  onStatusChange(post: Post, status: PostStatus): void {
    if (this.isBusy(post) || post.statusPost === status) {
      return;
    }

    this.busyIds.add(post.id);
    this.error = null;

    this.postsService
      .updateStatus(post.id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.posts = this.posts.map((item) =>
            item.id === updated.id ? updated : item,
          );
          this.busyIds.delete(post.id);
        },
        error: (err) => {
          this.busyIds.delete(post.id);
          this.handleError(err, 'Could not update post status.');
        },
      });
  }

  onHighlightChange(post: Post, checked: boolean): void {
    if (this.isBusy(post) || post.highlight === checked) {
      return;
    }

    this.busyIds.add(post.id);
    this.error = null;

    this.postsService
      .updateHighlight(post.id, checked)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.posts = this.posts.map((item) =>
            item.id === updated.id ? updated : item,
          );
          this.busyIds.delete(post.id);
        },
        error: (err) => {
          this.busyIds.delete(post.id);
          this.handleError(err, 'Could not update highlight flag.');
        },
      });
  }

  deletePost(post: Post): void {
    if (this.isBusy(post)) {
      return;
    }

    if (!window.confirm(`Delete post "${post.title || post.permalink}"?`)) {
      return;
    }

    this.busyIds.add(post.id);
    this.error = null;

    this.postsService
      .remove(post.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.posts = this.posts.filter((item) => item.id !== post.id);
          this.busyIds.delete(post.id);
        },
        error: (err) => {
          this.busyIds.delete(post.id);
          this.handleError(err, 'Could not delete post.');
        },
      });
  }

  private loadPosts(): void {
    this.loading = true;
    this.error = null;

    this.postsService
      .list()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.posts = this.mapPostsResponse(response);
          this.loading = false;
        },
        error: (err) => this.handleError(err, 'Could not load posts.'),
      });
  }

  private mapPostsResponse(response: unknown): Post[] {
    if (Array.isArray(response)) {
      return response as Post[];
    }

    const paged = response as { content?: Post[] };
    return paged?.content ?? [];
  }

  private handleError(err: unknown, fallback: string): void {
    this.loading = false;
    this.error = fallback;
    console.error(fallback, err);
  }
}
