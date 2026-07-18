import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NgIcon} from '@ng-icons/core';
import {RouterLink} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {CategoriesService} from '../../reader/services/categories.service';
import {Category} from '../models/category.model';
import {toUserMessage} from '../http/user-facing-error';

@Component({
  selector: 'app-category-nav-bar',
  standalone: true,
  templateUrl: './category-nav-bar.component.html',
  imports: [
    NgIf,
    NgClass,
    NgForOf,
    NgIcon,
    RouterLink
  ],
  styleUrl: './category-nav-bar.component.css'
})
export class CategoryNavBarComponent implements OnInit, OnDestroy {
  @Input() showMobileMenu!: boolean;

  @Output() closeMobileMenu = new EventEmitter<unknown>();

  categories: Category[] = [];

  loading: boolean = false;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = null;

    this.categoriesService
      .list()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.categories =  items?.content ?? [];
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = toUserMessage(err, 'Could not load categories ');
          console.error('Failed to load categories', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
