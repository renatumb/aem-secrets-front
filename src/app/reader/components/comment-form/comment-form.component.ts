import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommentsService } from '../../services/comments.service';
import { toUserMessage } from '../../../shared/http/user-facing-error';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
})
export class CommentFormComponent implements OnDestroy {
  @Input({ required: true }) postId!: string;
  @Output() commentSubmitted = new EventEmitter<void>();

  nameAuthor = '';
  emailAuthor = '';
  content = '';

  submitting = false;
  successMessage: string | null = null;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly commentsService: CommentsService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    const nameAuthor = this.nameAuthor.trim();
    const emailAuthor = this.emailAuthor.trim();
    const content = this.content.trim();

    if (!nameAuthor || !emailAuthor || !content || this.submitting) {
      return;
    }

    this.submitting = true;
    this.error = null;
    this.successMessage = null;

    this.commentsService
      .create({
        nameAuthor,
        emailAuthor,
        content,
        post: { id: this.postId },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.successMessage = 'Thanks! Your comment was submitted and is awaiting moderation ';
          this.nameAuthor = '';
          this.emailAuthor = '';
          this.content = '';
          this.commentSubmitted.emit();
        },
        error: (err) => {
          this.submitting = false;
          this.error = toUserMessage(err, 'Could not submit your comment. Please try again ');
          console.error('Comment submission failed', err);
        },
      });
  }
}
