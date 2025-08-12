import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "about", loadComponent: () => import('./about/about.component').then(c => c.AboutComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PublicRoutingModule { }
