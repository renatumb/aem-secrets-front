import {Component} from '@angular/core';

export type CommentStatus = 'APPROVED' | 'REJECTED' | 'PENDING';

export interface CommentRow {
  id: number;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  status: CommentStatus;
  /** When the current status was last set (moderation). */
  statusDate: string;
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent {
  comments: CommentRow[] = [
    {
      id: 1,
      content: 'Great post on AEM components — very clear walkthrough.',
      authorName: 'Jane Reader',
      authorEmail: 'jane@example.com',
      createdAt: '2026-05-10 09:12',
      status: 'APPROVED',
      statusDate: '2026-05-10 10:05',
    },
    {
      id: 2,
      content: 'Could you cover SPA editor next?',
      authorName: 'Sam Dev',
      authorEmail: 'sam.dev@example.com',
      createdAt: '2026-05-11 16:45',
      status: 'REJECTED',
      statusDate: '2026-05-11 17:00',
    },
    {
      id: 3,
      content: 'Thanks, this saved me a day of debugging.',
      authorName: 'Alex',
      authorEmail: 'alex@example.com',
      createdAt: '2026-05-12 11:03',
      status: 'PENDING',
      statusDate: '—',
    },
  ];

  private formatStatusDateNow(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /** Switch is ON only for APPROVED; toggles between APPROVED and REJECTED and stamps status date. */
  toggleApprovalSwitch(row: CommentRow): void {
    const next: CommentStatus = row.status === 'APPROVED' ? 'REJECTED' : 'APPROVED';
    const statusDate = this.formatStatusDateNow();
    this.comments = this.comments.map((c) =>
      c.id === row.id ? {...c, status: next, statusDate} : c
    );
  }

  deleteComment(row: CommentRow): void {
    if (!window.confirm('Delete this comment?')) {
      return;
    }
    this.comments = this.comments.filter((c) => c.id !== row.id);
  }
}
