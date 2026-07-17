import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import { ReaderRoutingModule } from './reader-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { SingleCategoryComponent } from './pages/single-category/single-category.component';
import { SingleTagComponent } from './pages/single-tag/single-tag.component';
import { SinglePostComponent } from './pages/single-post/single-post.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { SubscriptionFormComponent } from './components/subscription-form/subscription-form.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import {FooterComponentComponent} from '../shared/footer-component/footer-component.component';
import {HeaderComponentComponent} from '../shared/header-component/header-component.component';
import {NgIconsModule} from '@ng-icons/core';

import {matWbSunnyRound, matMenuOpenRound, matBrightness6Round, matBrightness2Round, matCloseRound} from '@ng-icons/material-icons/round';

import {PostCardComponent} from './components/post-card/post-card.component';
import {LoadPostsComponent} from './components/load-posts/load-posts.component';
import {READER_API_PROVIDER} from '../shared/http/api.config';
import {CategoriesService} from './services/categories.service';
import {SubscribersService} from './services/subscribers.service';
import {PostsService} from './services/posts.service';
import {CommentsService} from './services/comments.service';
import {ContactService} from './services/contact.service';


@NgModule({
  declarations: [
    HomeComponent,
    SingleCategoryComponent,
    SingleTagComponent,
    SinglePostComponent,
    AboutUsComponent,
    TermsConditionsComponent,
    ContactUsComponent,
    SubscriptionFormComponent,
    CommentFormComponent,
    CommentListComponent,
    PostCardComponent,
    LoadPostsComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReaderRoutingModule,
    FooterComponentComponent,
    HeaderComponentComponent,
    NgIconsModule.withIcons({
      matWbSunnyRound, matMenuOpenRound, matBrightness6Round, matBrightness2Round, matCloseRound
    })
  ],
  providers:[
    READER_API_PROVIDER,
    CategoriesService,
    SubscribersService,
    PostsService,
    CommentsService,
    ContactService,
  ]
})
export class ReaderModule { }
