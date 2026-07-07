import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../shared/models/post.model';

@Component({
  selector: 'app-load-posts',
  templateUrl: './load-posts.component.html',
  styleUrl: './load-posts.component.css'
})
export class LoadPostsComponent {
  @Input() posts: Post[] = [];
  @Input() loading : boolean = false;
  @Input() hasMore : boolean = false;
  @Output() loadMore = new EventEmitter<void>();
}
