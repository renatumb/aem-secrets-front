import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EMPTY, Subject} from 'rxjs';
import {catchError, switchMap, takeUntil, tap} from 'rxjs/operators';
import {CategoriesService} from '../../services/categories.service';
import {PostsService} from '../../services/posts.service';
import {Category} from '../../../shared/models/category.model';
import {Post} from '../../../shared/models/post.model';

@Component({
  selector: 'app-single-category',
  templateUrl: './single-category.component.html',
  styleUrl: './single-category.component.css',
})
export class SingleCategoryComponent implements OnInit, OnDestroy {
  category: Category | null = null;
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
    private readonly categoriesService: CategoriesService,
    private readonly postsService: PostsService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap({
            complete: () => {
              this.loading = true;
              this.error = null;
              this.category = null;
              this.posts = [];
              this.postsPage = 0;
              this.postsHasMore = false;
              this.postsError = null;
            }
          }
        ),
        switchMap((params) => {
          const name = params.get('name');

          if (!name) {
            this.loading = false;
            this.error = 'No category selected.';
            return EMPTY;
          }

          return this.categoriesService.getByName(name).pipe(
            catchError((err) => {
              this.loading = false;
              this.error = 'Could not load category.';
              console.error('Failed to load category', err);
              return EMPTY;
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((cat) => {
        this.category = cat;
        this.loading = false;
        this.loadCategoryPosts(true);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMore(): void {
    if (this.postsLoading || !this.postsHasMore || !this.category) {
      return;
    }

    this.postsPage += 1;
    this.loadCategoryPosts(false);
  }

  private loadCategoryPosts(reset: boolean): void {
    if (!this.category) {
      return;
    }

    if (reset) {
      this.postsPage = 0;
      this.posts = [];
    }

    this.postsLoading = true;
    this.postsError = null;

    this.postsService
      .listByCategory(this.category.id, this.postsPage, this.postsPageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const page = this.postsService.mapPostsPage(response, this.postsPage, this.postsPageSize,);

          this.posts = reset ? page.posts : [...this.posts, ...page.posts];this.postsHasMore = page.hasMore;this.postsLoading = false;
        },
        error: (err) => {
          this.postsLoading = false;
          this.postsError = 'Could not load posts for this category.';
          console.error('Could not load category posts.', err);
        },
      });
  }
}
