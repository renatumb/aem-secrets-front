import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommentsService } from '../../services/comments.service';
import { Comment, StatusComment } from '../../../shared/models/comment.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit, OnDestroy {
  readonly statusComment = StatusComment;

  comments: Comment[] = [];
  loading = false;
  error: string | null = null;

  private readonly busyIds = new Set<number>();
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly commentsService: CommentsService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isBusy(row: Comment): boolean {
    return this.busyIds.has(row.id);
  }

  /** Switch is ON only for ACCEPTED; toggles between ACCEPTED and REJECTED. */
  toggleApprovalSwitch(row: Comment): void {
    if (this.busyIds.has(row.id)) {
      return;
    }

    const nextStatus = row.statusComment === StatusComment.ACCEPTED ? StatusComment.REJECTED : StatusComment.ACCEPTED;

    this.busyIds.add(row.id);
    this.error = null;

    this.commentsService
      .updateStatus(row.id, nextStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.comments = this.comments.map((comment) =>
            comment.id === updated.id ? updated : comment,
          );
          this.busyIds.delete(row.id);
        },
        error: (err) => {
          this.busyIds.delete(row.id);
          this.handleError(err, 'Could not update comment status.');
        },
      });
  }

  deleteComment(row: Comment): void {
    if (!window.confirm('Delete this comment?')) {
      return;
    }

    if (this.busyIds.has(row.id)) {
      return;
    }

    this.busyIds.add(row.id);
    this.error = null;

    this.commentsService
      .delete(row.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.comments = this.comments.filter((comment) => comment.id !== row.id);
          this.busyIds.delete(row.id);
        },
        error: (err) => {
          this.busyIds.delete(row.id);
          this.handleError(err, 'Could not delete comment.');
        },
      });
  }

  private loadComments(): void {
    this.loading = true;
    this.error = null;

    this.commentsService
      .list({ orderBy: 'creationDate' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.comments = this.commentsService.mapCommentsResponse(response);
          this.loading = false;
        },
        error: (err) => this.handleError(err, 'Could not load comments.'),
      });
  }

  private handleError(err: unknown, fallback: string): void {
    this.loading = false;
    this.error = fallback;
    console.error(fallback, err);
  }
}
