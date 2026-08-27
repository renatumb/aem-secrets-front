import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  featured: Post[] = [];
  latest: Post[] = [];

  featuredLoading: boolean = false;
  latestLoading : boolean = false;
  latestHasMore : boolean = false;

  featuredError: string | null = null;
  latestError: string | null = null;

  private latestPage = 0;
  private readonly latestPageSize = 6;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly postsService: PostsService) {}

  ngOnInit(): void {
    this.loadFeatured();
    this.loadLatest(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMore(): void {
    if (this.latestLoading || !this.latestHasMore) {
      return;
    }

    this.latestPage += 1;
    this.loadLatest(false);
  }

  private loadFeatured(): void {
    this.featuredLoading = true;
    this.featuredError = null;

    this.postsService
      .listFeatured()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.featured = this.postsService.mapPostsResponse(response);
          this.featuredLoading = false;
        },
        error: (err) => {
          this.featuredLoading = false;
          this.featuredError = 'Could not load featured posts.';
          console.error('Could not load featured posts.', err);
        },
      });
  }

  private loadLatest(reset: boolean): void {
    if (reset) {
      this.latestPage = 0;
      this.latest = [];
    }

    this.latestLoading = true;
    this.latestError = null;

    this.postsService
      .listLatest(this.latestPage, this.latestPageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const page = this.postsService.mapPostsPage(response, this.latestPage, this.latestPageSize);

          this.latest = reset ? page.posts : [...this.latest, ...page.posts];
          this.latestHasMore = page.hasMore;
          this.latestLoading = false;
        },
        error: (err) => {
          this.latestLoading = false;
          this.latestError = 'Could not load latest posts.';
          console.error('Could not load latest posts.', err);
        },
      });
  }
}
