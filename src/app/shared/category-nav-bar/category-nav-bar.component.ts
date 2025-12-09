import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NgIcon} from '@ng-icons/core';
import {RouterLink} from '@angular/router';

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
export class CategoryNavBarComponent implements OnInit{
  @Input() showMobileMenu!: boolean;

  @Output() closeMobileMenu = new EventEmitter<unknown>();

  categories : { categoryName: string, Description: string }[] = [];

  ngOnInit(): void {


      this.categories.push( {'categoryName':'1categAA','Description':'Desc AAA'} );
      this.categories.push( {'categoryName':'2categBBBBbb','Description':'Desc BBBBbb'} );
      this.categories.push( {'categoryName':'3categCCCCCCCCC','Description':'Desc CCCCCCCCC'} );
      this.categories.push( {'categoryName':'4categDD','Description':'Desc DD'} );
      this.categories.push( {'categoryName':'5categEEEE','Description':'Desc EEEE'} );
      this.categories.push( {'categoryName':'6categFFFFFF','Description':'Desc FFFFFF'} );
      this.categories.push( {'categoryName':'7categFFFFFF','Description':'Desc FFFFFF'} );
      this.categories.push( {'categoryName':'8categFFFFFF','Description':'Desc FFFFFF'} );
      this.categories.push( {'categoryName':'9categFFFFFF','Description':'Desc FFFFFF'} );
      this.categories.push( {'categoryName':'0categFFFFFF','Description':'Desc FFFFFF'} );
      this.categories.push( {'categoryName':'1categFFFFFF','Description':'Desc FFFFFF'} );
      this.categories.push( {'categoryName':'12LAST','Description':'Desc FFFFFF'} );
  }
}
