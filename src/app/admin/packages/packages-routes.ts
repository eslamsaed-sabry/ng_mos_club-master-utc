import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadComponent: () => import('./packages.component').then(c => c.PackagesComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class PackagesRoutingModule { }
