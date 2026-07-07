import { Component, Input } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Input() compact = false;

  readonly placeholderThumbnail = 'https://placehold.co/600x400?text=No+image';

  constructor(private readonly postsService: PostsService) {}

  get thumbnailUrl(): string {
    if (!this.post?.thumbnail) {
      return this.placeholderThumbnail;
    }

    return this.postsService.resolveThumbnailUrl(this.post.thumbnail) || this.placeholderThumbnail;
  }
}
