import { Component } from '@angular/core';

export interface CategoryItem {
  id: number;
  description: string;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  newCategoryName = '';

  categories: CategoryItem[] = [
    { id: 1, description: 'Category xxx' },
    { id: 2, description: 'Category yyy' },
    { id: 3, description: 'Category xxx' },
    { id: 4, description: 'Category yyy' },
    { id: 5, description: 'Category xxx' },
    { id: 6, description: 'Category yyy' },
  ];

  saveCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) {
      return;
    }

    const nextId =  this.categories.length === 0 ? 1 : Math.max(...this.categories.map((c) => c.id), 0) + 1;

    this.categories = [...this.categories, { id: nextId, description: name }];
    this.newCategoryName = '';
  }

  editCategory(row: CategoryItem): void {
    const next = window.prompt('Edit category description', row.description);

    if (next === null) {
      return;
    }
    const trimmed = next.trim();
    if (!trimmed) {
      return;
    }
    this.categories = this.categories.map((c) =>
      c.id === row.id ? { ...c, description: trimmed } : c
    );
  }

  deleteCategory(id: number): void {
    if (!window.confirm('Delete this category?')) {
      return;
    }
    this.categories = this.categories.filter((c) => c.id !== id);
  }
}
