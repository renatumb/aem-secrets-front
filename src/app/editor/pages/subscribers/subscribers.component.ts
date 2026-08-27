import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SubscribersService } from '../../services/subscribers.service';
import { Subscriber, StatusChangeSource } from '../../../shared/models/subscriber.model';
import { toUserMessage } from '../../../shared/http/user-facing-error';

const STATUS_CHANGE_SOURCE_META: Record<StatusChangeSource, { icon: string; label: string }> = {
                [StatusChangeSource.SUBSCRIBE]        : {icon: 'matAppRegistrationRound', label: 'Subscribed via signup form'},
                [StatusChangeSource.UNSUBSCRIBE_LINK] : {icon: 'matLinkOffRound', label: 'Unsubscribed via email link'},
                [StatusChangeSource.EDITOR_PATCH]     : {icon: 'matPerson4Outline', label: 'Changed by editor',}
};

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.css',
})
export class SubscribersComponent implements OnInit, OnDestroy {
  readonly statusChangeSource = StatusChangeSource;

  subscribers: Subscriber[] = [];

  loading = false;
  /** Set of ids being mutated (status toggle). */
  busyIds = new Set<string>();
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly subscribersService: SubscribersService) {}

  ngOnInit(): void {
    this.loadSubscribers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isBusy(row: Subscriber): boolean {
    return this.busyIds.has(row.email);
  }

  statusChangeSourceIcon(source: StatusChangeSource): string {
    return STATUS_CHANGE_SOURCE_META[source]?.icon ?? 'matQuestionMarkRound';
  }

  statusChangeSourceLabel(source: StatusChangeSource): string {
    return STATUS_CHANGE_SOURCE_META[source]?.label ?? 'Unknown source';
  }

  toggleActive(row: Subscriber): void {
    if (this.busyIds.has(row.email)) {
      return;
    }
    this.busyIds.add(row.email);
    this.error = null;

    this.subscribersService
      .switchActive(row.email, !row.enableSubscription)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.subscribers = this.subscribers.map((s) =>
            s.email === updated.email ? updated : s,
          );
          this.busyIds.delete(row.email);
        },
        error: (err) => {
          this.busyIds.delete(row.email);
          this.handleError(err, 'Could not update subscriber status.');
        },
      });
  }



  private loadSubscribers(): void {
    this.loading = true;
    this.error = null;

    this.subscribersService
      .list()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.subscribers = response?.content ?? response ?? [];
          this.loading = false;
        },
        error: (err) => this.handleError(err, 'Could not load subscribers.'),
      });
  }

  private handleError(err: unknown, fallback: string): void {
    this.loading = false;
    this.error = toUserMessage(err, fallback);
    console.error(fallback, err);
  }
}
