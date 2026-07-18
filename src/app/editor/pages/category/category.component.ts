import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { Category, CreateUpdateCategoryDto } from '../../../shared/models/category.model';
import { toUserMessage } from '../../../shared/http/user-facing-error';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit, OnDestroy {
  newCategoryName: string = '';
  newCategoryDescription: string = '';

  categories: Category[] = [];

  loading : boolean = false;
  saving: boolean = false;
  error: string | null = null;

  /** Id of the row currently in inline-edit mode, or null if none. */
  editingId: number | null = null;
  /** Live-bound draft values for the row being edited. */
  editDraft: CreateUpdateCategoryDto = { name: '', description: '' };
  /** Snapshot of the row's values at edit start, used to detect "dirty". */
  editOriginal: CreateUpdateCategoryDto = { name: '', description: '' };
  /** True while the inline edit is being persisted. */
  savingEdit : boolean = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveCategory(): void {
    const name = this.newCategoryName.trim();
    const description = this.newCategoryDescription.trim();

    if (!name || !description || this.saving) {
      return;
    }
    this.saving = true;
    this.error = null;

    const newCategory: CreateUpdateCategoryDto ={
      name: name,
      description: description
    }

    this.categoriesService
      .create( newCategory )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created) => {
          this.categories = [...this.categories, created];
          this.newCategoryName = '';
          this.newCategoryDescription = '';
          this.saving = false;
        },
        error: (err) => this.handleError(err, 'Could not create category.'),
      });
  }

  isEditing(row: Category): boolean {
    return this.editingId === row.id;
  }

  /** True when the current draft differs from the snapshot taken at edit start. */
  isDirty(): boolean {
    if (this.editingId === null) {
      return false;
    }
    return (
      this.editDraft.name !== this.editOriginal.name ||
      this.editDraft.description !== this.editOriginal.description
    );
  }

  /** Label for the row's primary action: 'Edit' until something changes, then 'Save'. */
  editButtonLabel(row: Category): string {
    if (this.savingEdit && this.isEditing(row)) {
      return 'Saving...';
    }
    if (!this.isEditing(row)) {
      return 'Edit';
    }
    return this.isDirty() ? 'Save' : 'Edit';
  }

  /**
   * Single button drives three transitions:
   * - not editing  -> enter edit mode
   * - editing dirty -> persist via API
   * - editing clean -> leave edit mode (no-op revert)
   */
  onEditButton(row: Category): void {
    if (!this.isEditing(row)) {
      this.startEdit(row);
      return;
    }
    if (this.isDirty()) {
      this.saveEdit(row);
      return;
    }
    this.cancelEdit();
  }

  deleteCategory(id: number): void {
    if (!window.confirm('Delete this category?')) {
      return;
    }
    this.error = null;

    this.categoriesService
      .remove(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.categories = this.categories.filter((c) => c.id !== id);
          if (this.editingId === id) {
            this.cancelEdit();
          }
          alert('Deleted successfully.');
        },

        error: (err) => {
          this.handleError(err, 'Could not delete category. ' )
        },
      });
  }

  private startEdit(row: Category): void {
    this.editingId = row.id;
    this.editOriginal = { name: row.name, description: row.description };
    this.editDraft = { ...this.editOriginal };
    this.error = null;
  }

  private cancelEdit(): void {
    this.editingId = null;
    this.savingEdit = false;
  }

  private saveEdit(row: Category): void {
    if (this.savingEdit) {
      return;
    }
    const payload: CreateUpdateCategoryDto = {
      name: this.editDraft.name.trim(),
      description: this.editDraft.description.trim(),
    };
    if (!payload.name || !payload.description) {
      this.error = 'Name and description cannot be empty.';
      return;
    }

    this.savingEdit = true;
    this.error = null;

    this.categoriesService
      .update(row.id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.categories = this.categories.map((c) => (c.id === updated.id ? updated : c));
          alert('updated successfully')
          this.cancelEdit();
        },
        error: (err) => {
          this.savingEdit = false;
          this.handleError(err, 'Could not update category.');
        },
      });
  }

  private loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.categoriesService
      .list()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.categories = items?.content ?? [];
          this.loading = false;
        },
        error: (err) => this.handleError(err, 'Could not load categories.'),
      });
  }

  private handleError(err: unknown, fallback: string): void {
    this.loading = false;
    this.saving = false;
    this.error = toUserMessage(err, fallback);
    console.error(fallback, err);
  }
}
