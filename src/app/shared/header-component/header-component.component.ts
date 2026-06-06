import {Component, Input} from '@angular/core';
import {NgIcon} from '@ng-icons/core';
import {CategoryNavBarComponent} from '../category-nav-bar/category-nav-bar.component';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ThemeId} from '../../core/theme/theme.model';
import {ThemeService} from '../../core/theme/theme.service';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [
    NgIcon,
    CategoryNavBarComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './header-component.component.html',
  styleUrl: './header-component.component.css'
})
export class HeaderComponentComponent {
  @Input() showCategoryNavBar!: boolean;

  showMobileMenu: boolean = false

  constructor(private readonly themeService: ThemeService) {}

  switchTheme(theme: ThemeId): void {
    this.themeService.setTheme(theme);
  }
}
