import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-create-post-draft',
  templateUrl: './create-post-draft.component.html',
  styleUrl: './create-post-draft.component.css',
})
export class CreatePostDraftComponent implements OnInit, OnDestroy {
  loading = true;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly postsService: PostsService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.postsService
      .createDraft()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (post) => {
          this.loading = false;

          if (!post?.id) {
            this.error = 'Draft was created but no post id was returned.';
            return;
          }

          this.router.navigate(
            ['/editor/posts/edit'],
            {
              queryParams: { id: post.id },
              replaceUrl: true,
            },
          );
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message ?? err?.message ?? 'Could not create draft post.';
          console.error('Could not create draft post.', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backToPosts(): void {
    this.router.navigate(['/editor/posts']);
  }
}
