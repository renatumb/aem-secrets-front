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
  matCategoryRound,
  matThumbDownRound,
  matThumbUpRound,
  matIndeterminateCheckBoxRound,
} from '@ng-icons/material-icons/round';

import {FooterComponentComponent} from '../shared/footer-component/footer-component.component';
import { FormsModule } from '@angular/forms';
import { PostEditorComponent } from './components/post-editor/post-editor.component';
import { PostListComponent } from './components/post-list/post-list.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {EDITOR_API_PROVIDER} from '../shared/http/api.config';
import {CategoriesService} from './services/categories.service';
import {SubscribersService} from './services/subscribers.service';
import {PostsService} from './services/posts.service';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    CategoryComponent,
    PostComponent,
    SubscribersComponent,
    CommentsComponent,
    PostEditorComponent,
    PostListComponent
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
      matCategoryRound,
      matThumbDownRound,
      matThumbUpRound,
      matIndeterminateCheckBoxRound,
    }),
    FooterComponentComponent,
    FormsModule,
    AngularEditorModule
  ],
  providers:[
    EDITOR_API_PROVIDER,
    CategoriesService,
    SubscribersService,
    PostsService,
  ]
})
export class EditorModule { }
