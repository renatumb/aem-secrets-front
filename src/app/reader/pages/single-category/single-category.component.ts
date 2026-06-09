import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EMPTY, Subject} from 'rxjs';
import {catchError, switchMap, takeUntil, tap} from 'rxjs/operators';
import {CategoriesService} from '../../services/categories.service';
import {Category} from '../../../shared/models/category.model';

@Component({
  selector: 'app-single-category',
  templateUrl: './single-category.component.html',
  styleUrl: './single-category.component.css',
})
export class SingleCategoryComponent implements OnInit, OnDestroy {
  category: Category | null = null;
  loading = false;
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly route: ActivatedRoute,
              private readonly categoriesService: CategoriesService) {
  }


  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.loading = true;
          this.error = null;
          this.category = null;
        }),

        switchMap((params) => {
          const name = params.get('name');

          if (!name) {
            this.loading = false;
            this.error = 'No category selected.';
            return EMPTY;
          }
          return this.categoriesService.getByName(name).pipe(
            catchError((err) => {
              this.loading = false;
              this.error = 'Could not load category.';
              console.error('Failed to load category', err);
              return EMPTY;
            }),
          );
        }),

        takeUntil(this.destroy$),
      )
      .subscribe((cat) => {
        this.category = cat;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
