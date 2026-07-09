import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Comment } from '../../../shared/models/comment.model';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
})
export class CommentListComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) postId!: string;

  comments: Comment[] = [];
  loading = false;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

   constructor(private readonly commentsService: CommentsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId']?.currentValue) {
      this.loadComments();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadComments(): void {
    if (!this.postId) {
      this.comments = [];
      return;
    }

    this.loading = true;
    this.error = null;

    this.commentsService
      .listAcceptedByPost(this.postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comments) => {
          this.comments = comments;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message ?? 'Could not load comments.';
          console.error('Could not load comments.', err);
        },
      });
  }
}
