import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CategoryComponent } from './category.component';
import { CategoriesService } from '../../services/categories.service';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  beforeEach(async () => {
    const serviceStub: Partial<CategoriesService> = {
      list: () => of([]),
      create: () => of({ id: 1, name: 'x', description: 'x' }),
      update: () => of({ id: 1, name: 'x', description: 'x' }),
      remove: () => of(void 0),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule],
      declarations: [CategoryComponent],
      providers: [{ provide: CategoriesService, useValue: serviceStub }],
      schemas: [],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
