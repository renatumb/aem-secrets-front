import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css'
})
export class SinglePostComponent implements OnInit, OnDestroy {
  post: Post | null = null;

  loading = false;
  error: string | null = null;

  readonly placeholderThumbnail = 'https://placehold.co/1200x600?text=No+image';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postsService: PostsService,
  ) {}

  ngOnInit(): void {
    this.resolvePost();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get heroImageUrl(): string {
    if (!this.post?.thumbnail) {
      return this.placeholderThumbnail;
    }

    return this.postsService.resolveThumbnailUrl(this.post.thumbnail) || this.placeholderThumbnail;
  }

  private resolvePost(): void {
    const slug = this.route.snapshot.paramMap.get('post-id');
    const statePost = history.state?.['post'] as Post | undefined;

    if (statePost?.permalink && slug && statePost.permalink === slug) {
      this.post = statePost;
      return;
    }

    if (!slug) {
      this.error = 'No post selected.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.postsService
      .getBySlug(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (post) => {
          this.post = post;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Could not load post.';
          console.error('Could not load post.', err);
        },
      });
  }
}
