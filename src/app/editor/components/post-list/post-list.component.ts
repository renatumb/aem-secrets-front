import { Component } from '@angular/core';

export interface PostListRow {
  id: number;
  imageUrl: string;
  imageAlt: string;
  title: string;
  excerpt: string;
  category: string;
  dateLabel: string;
}

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  /** Demo rows matching the reference list layout; replace with API data when wired. */
  readonly posts: PostListRow[] = [
    {
      id: 1,
      imageUrl: 'https://picsum.photos/seed/aem-post-1/320/180',
      imageAlt: 'Abstract thumbnail for post 1',
      title: 'Getting started with Firebase Hosting',
      excerpt:
        'Walk through deploying a static site or SPA to Firebase Hosting, setting up preview channels, and rolling back releases without downtime.',
      category: 'Firebase',
      dateLabel: 'Nov 2, 2021',
    },
    {
      id: 2,
      imageUrl: 'https://picsum.photos/seed/aem-post-2/320/180',
      imageAlt: 'Abstract thumbnail for post 2',
      title: 'Bootstrap grid patterns that scale',
      excerpt:
        'Use responsive breakpoints, gutter spacing, and utility classes so your layout stays predictable from mobile to desktop.',
      category: 'Bootstrap',
      dateLabel: 'Oct 18, 2021',
    },
    {
      id: 3,
      imageUrl: 'https://picsum.photos/seed/aem-post-3/320/180',
      imageAlt: 'Abstract thumbnail for post 3',
      title: 'Angular change detection in practice',
      excerpt:
        'When to use OnPush, how signals and async pipes reduce churn, and how to avoid unnecessary re-renders in large tables.',
      category: 'Angular',
      dateLabel: 'Sep 7, 2021',
    },
    {
      id: 4,
      imageUrl: 'https://picsum.photos/seed/aem-post-4/320/180',
      imageAlt: 'Abstract thumbnail for post 4',
      title: 'Curated resources for content authors',
      excerpt:
        'A short list of templates, checklists, and AEM-specific references your editorial team can use every week.',
      category: 'Resources',
      dateLabel: 'Aug 22, 2021',
    },
  ];
}
