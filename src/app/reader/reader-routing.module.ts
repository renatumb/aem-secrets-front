import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {SingleCategoryComponent} from './pages/single-category/single-category.component';
import {SingleTagComponent} from './pages/single-tag/single-tag.component';
import {SinglePostComponent} from './pages/single-post/single-post.component';
import {AboutUsComponent} from './pages/about-us/about-us.component';
import {TermsConditionsComponent} from './pages/terms-conditions/terms-conditions.component';
import {ContactUsComponent} from './pages/contact-us/contact-us.component';

const routes: Routes = [
  {path: '', component: HomeComponent, title: 'AEM Secrets: Home'},
  {path: 'category/:name', component: SingleCategoryComponent, title: 'AEM Secrets: Categories'},
  {path: 'tag/:tagString', component: SingleTagComponent, title: 'AEM Secrets: Tags'},
  {path: 'post/:post-id', component: SinglePostComponent, title: 'AEM Secrets: Post'},
  {path: 'about-us', component: AboutUsComponent, title: 'AEM Secrets: About'},
  {path: 'terms-conditions', component: TermsConditionsComponent, title: 'AEM Secrets: Terms & Conditions'},
  {path: 'contact-us', component: ContactUsComponent, title: 'AEM Secrets: Contact'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReaderRoutingModule { }
