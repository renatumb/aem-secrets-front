import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoryComponent } from './pages/category/category.component';
import { PostComponent } from './pages/post/post.component';
import { SubscribersComponent } from './pages/subscribers/subscribers.component';
import { CommentsComponent } from './pages/comments/comments.component';


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
    EditorRoutingModule
  ]
})
export class EditorModule { }
