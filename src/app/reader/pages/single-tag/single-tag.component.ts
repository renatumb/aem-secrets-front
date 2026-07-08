import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {PostsService} from '../../services/posts.service';
import {Post} from '../../../shared/models/post.model';

@Component({
  selector: 'app-single-tag',
  templateUrl: './single-tag.component.html',
  styleUrl: './single-tag.component.css',
})
export class SingleTagComponent implements OnInit, OnDestroy {
  tagName: string | null = null;
  posts: Post[] = [];

  loading = false;
  postsLoading = false;
  postsHasMore = false;
  error: string | null = null;
  postsError: string | null = null;

  private postsPage = 0;
  private readonly postsPageSize = 6;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postsService: PostsService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.loading = true;
          this.error = null;
          this.tagName = null;
          this.posts = [];
          this.postsPage = 0;
          this.postsHasMore = false;
          this.postsError = null;
        }),
        takeUntil(this.destroy$),
      ).subscribe((params) => {
      const rawName = params.get('tagString');

      if (!rawName) {
        this.loading = false;
        this.error = 'No tag selected.';
        return;
      }

      const decodedName = decodeURIComponent(rawName).trim();
      if (!decodedName) {
        this.loading = false;
        this.error = 'No tag selected.';
        return;
      }

      this.tagName = decodedName;
      this.loading = false;
      this.loadTagPosts(true);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMore(): void {
    if (this.postsLoading || !this.postsHasMore || !this.tagName) {
      return;
    }

    this.postsPage += 1;
    this.loadTagPosts(false);
  }

  private loadTagPosts(reset: boolean): void {
    if (!this.tagName) {
      return;
    }

    if (reset) {
      this.postsPage = 0;
      this.posts = [];
    }

    this.postsLoading = true;
    this.postsError = null;

    this.postsService
      .listByTag(this.tagName, this.postsPage, this.postsPageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const page = this.postsService.mapPostsPage(
            response,
            this.postsPage,
            this.postsPageSize,
          );

          this.posts = reset ? page.posts : [...this.posts, ...page.posts];
          this.postsHasMore = page.hasMore;
          this.postsLoading = false;
        },
        error: (err) => {
          this.postsLoading = false;
          this.postsError = 'Could not load posts for this tag.';
          console.error('Could not load tag posts.', err);
        },
      });
  }
}
