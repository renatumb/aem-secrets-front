import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CategoryNavBarComponent } from './category-nav-bar.component';
import { CategoriesService } from '../../reader/services/categories.service';

describe('CategoryNavBarComponent', () => {
  let component: CategoryNavBarComponent;
  let fixture: ComponentFixture<CategoryNavBarComponent>;

  beforeEach(async () => {
    const serviceStub: Partial<CategoriesService> = { list: () => of([]) };

    await TestBed.configureTestingModule({
      imports: [CategoryNavBarComponent, RouterTestingModule],
      providers: [{ provide: CategoriesService, useValue: serviceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
