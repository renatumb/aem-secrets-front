import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: () => import('./reader/reader.module').then(m => m.ReaderModule)},
  {path: 'editor', loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule)},
  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
