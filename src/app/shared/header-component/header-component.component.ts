import {Component, forwardRef, Input} from '@angular/core';
import {NgIcon} from '@ng-icons/core';
import {CategoryNavBarComponent} from '../category-nav-bar/category-nav-bar.component';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

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
  @Input() showNavBar!: boolean;

  showMobileMenu: boolean = false

  switchTheme(theme: string) {
    let body = document.getElementsByTagName('body')[0];

    body.removeAttribute('data-theme');
    body.setAttribute('data-theme', theme);
    console.log('theme clicked ' + theme);
  }

  protected readonly console = console;
}
