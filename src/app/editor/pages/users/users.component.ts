import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { User } from '../../../shared/models/user.model';
import { toUserMessage } from '../../../shared/http/user-facing-error';
import { PLACEHOLDER_THUMBNAIL } from '../../../shared/placeholder';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];

  loading = false;
  error: string | null = null;

  readonly placeholderPhoto = PLACEHOLDER_THUMBNAIL;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  photoUrl(user: User): string {
    if (!user.photoProfile) {
      return this.placeholderPhoto;
    }
    return this.usersService.resolvePhotoProfileUrl(user.photoProfile);
  }

  onPhotoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.placeholderPhoto) {
      img.src = this.placeholderPhoto;
    }
  }

  private loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.usersService
      .list()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.users = response?.content ?? response ?? [];
          this.loading = false;
        },
        error: (err) => this.handleError(err, 'Could not load users.'),
      });
  }

  private handleError(err: unknown, fallback: string): void {
    this.loading = false;
    this.error = toUserMessage(err, fallback);
    console.error(fallback, err);
  }
}
