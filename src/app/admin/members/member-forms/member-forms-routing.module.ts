import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsPipe } from 'src/app/pipes/permissions.pipe';
import { memberFormResolverResolver, membershipFormResolverResolver } from './member-form-resolver.resolver';

const routes: Routes = [
  {
    path: 'member/:type', loadComponent: () => import('./member-form/member-form.component').then(c => c.MemberFormComponent),
    resolve: [memberFormResolverResolver]
  },
  {
    path: 'membership/:type', loadComponent: () => import('./membership-form/membership-form.component').then(c => c.MembershipFormComponent),
    resolve: [membershipFormResolverResolver]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [PermissionsPipe],
  exports: [RouterModule]
})
export class MemberFormsRoutingModule { }
