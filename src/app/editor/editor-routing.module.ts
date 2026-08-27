import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/auth.guard';
import {LoginComponent} from './pages/login/login.component';
import {CommentsComponent} from './pages/comments/comments.component';
import {SubscribersComponent} from './pages/subscribers/subscribers.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {CategoryComponent} from './pages/category/category.component';
import {PostComponent} from './pages/post/post.component';
import {PostListComponent} from './components/post-list/post-list.component';
import {PostEditorComponent} from './components/post-editor/post-editor.component';
import {CreatePostDraftComponent} from './components/create-post-draft/create-post-draft.component';


const routes: Routes = [
  {path: '', component: LoginComponent, title: 'AEM Secrets: Login'},
  {path: 'dashboard', component: DashboardComponent, title: 'AEM Secrets: Dashboard', canActivate: [AuthGuard]},
  {path: 'category', component: CategoryComponent, title: 'AEM Secrets: Categories', canActivate: [AuthGuard]},
  {path: 'comments', component: CommentsComponent, title: 'AEM Secrets: Comments', canActivate: [AuthGuard]},
  {path: 'subscribers', component: SubscribersComponent, title: 'AEM Secrets: Subscribers', canActivate: [AuthGuard]},

  {
    path: 'posts',
    component: PostComponent,
    title: 'AEM Secrets: Posts',
    canActivate: [AuthGuard],
    children: [
      {path: '', component: PostListComponent      },
      {path: 'new', component: CreatePostDraftComponent},
      {path: 'edit', component: PostEditorComponent},
      {path: '**', redirectTo: 'posts'},
    ]
  },

  {path: '**', redirectTo: 'dashboard'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
