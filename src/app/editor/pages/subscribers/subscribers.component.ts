import { Component } from '@angular/core';

export interface SubscriberRow {
  no: number;
  name: string;
  email: string;
  enabled: boolean;
}

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.css'
})
export class SubscribersComponent {
  subscribers: SubscriberRow[] = [
    { no: 1, name: 'John', email: 'john@gmail.com', enabled: true },
    { no: 2, name: 'Sam', email: 'sam@gmail.com', enabled: false },
    { no: 3, name: 'Doe', email: 'doe@gmail.com', enabled: true },
  ];

  toggleEnabled(row: SubscriberRow): void {
    this.subscribers = this.subscribers.map((s) =>
      s.no === row.no ? { ...s, enabled: !s.enabled } : s
    );
  }

  deleteSubscriber(row: SubscriberRow): void {
    if (!window.confirm(`Remove subscriber ${row.name}?`)) {
      return;
    }
    this.subscribers = this.subscribers.filter((s) => s.no !== row.no);
    this.subscribers = this.subscribers.map((s, i) => ({ ...s, no: i + 1 }));
  }
}
