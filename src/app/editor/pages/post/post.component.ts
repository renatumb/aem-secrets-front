import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit, OnDestroy {
  showNewPostButton = true;

  private navigationSub?: Subscription;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.updateNewPostButtonVisibility(this.router.url);
    this.navigationSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateNewPostButtonVisibility(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private updateNewPostButtonVisibility(url: string): void {
    this.showNewPostButton = !url.includes('/posts/new');
  }
}
