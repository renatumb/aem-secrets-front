import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoryComponent } from './pages/category/category.component';
import { PostComponent } from './pages/post/post.component';
import { SubscribersComponent } from './pages/subscribers/subscribers.component';
import { CommentsComponent } from './pages/comments/comments.component';
import {HeaderComponentComponent} from '../shared/header-component/header-component.component';
import {NgIconsModule} from '@ng-icons/core';
import {
  matBrightness2Round,
  matBrightness6Round, matCloseRound,
  matMenuOpenRound,
  matWbSunnyRound,
  matListAltRound,
  matStickyNote2Round,
  matGroupsRound,
  matForumRound,
  matCategoryRound
} from '@ng-icons/material-icons/round';
import {FooterComponentComponent} from '../shared/footer-component/footer-component.component';


@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    CategoryComponent,
    PostComponent,
    SubscribersComponent,
    CommentsComponent
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    HeaderComponentComponent,
    NgIconsModule.withIcons({
      matWbSunnyRound,
      matMenuOpenRound,
      matBrightness6Round,
      matBrightness2Round,
      matCloseRound,
      matListAltRound,
      matStickyNote2Round,
      matGroupsRound,
      matForumRound,
      matCategoryRound
    }),
    FooterComponentComponent
  ]
})
export class EditorModule { }
