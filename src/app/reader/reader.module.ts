import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderRoutingModule } from './reader-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { SingleCategoryComponent } from './pages/single-category/single-category.component';
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
import { PostCardComponent } from './components/post-card/post-card.component';
import { LoadPostsComponent } from '../src/app/reader/components/load-posts/load-posts.component';


@NgModule({
  declarations: [
    HomeComponent,
    SingleCategoryComponent,
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
    ReaderRoutingModule,
    FooterComponentComponent,
    HeaderComponentComponent,
    NgIconsModule.withIcons({matWbSunnyRound, matMenuOpenRound, matBrightness6Round, matBrightness2Round, matCloseRound})
  ]
})
export class ReaderModule { }
