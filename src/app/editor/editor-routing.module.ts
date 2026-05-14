import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {CommentsComponent} from './pages/comments/comments.component';
import {SubscribersComponent} from './pages/subscribers/subscribers.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {CategoryComponent} from './pages/category/category.component';
import {PostComponent} from './pages/post/post.component';


const routes: Routes = [
  {path: '', component: LoginComponent, title: 'Aem Secrets: Login'},
  {path: 'dashboard', component: DashboardComponent, title: 'Aem Secrets: Dashboard'},
  {path: 'category', component: CategoryComponent, title: 'Category'},
  {path: 'comments', component: CommentsComponent, title: 'Comments'},
  {path: 'subscribers', component: SubscribersComponent, title: 'Subscribers'},
  {path: 'posts', component: PostComponent, title: 'Posts'},
  {path: '**', redirectTo: 'dashboard'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
