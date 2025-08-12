import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageTypes, ImageTypesName } from 'src/app/models/enums';


const routes: Routes = [
  { path: 'permissions', loadComponent: () => import('./permissions/permissions.component').then(c => c.PermissionsComponent) },
  { path: 'roles', loadComponent: () => import('./roles/roles.component').then(c => c.RolesComponent) },
  { path: 'users', loadComponent: () => import('./users/users.component').then(c => c.UsersComponent) },
  {
    path: 'gym-images', loadComponent: () => import('./gym-images/gym-images.component').then(c => c.GymImagesComponent),
    data: { imageType: ImageTypes.GymImage, imageTypeName: ImageTypesName.gymImages }
  },
  {
    path: 'classes-schedule-images', loadComponent: () => import('./gym-images/gym-images.component').then(c => c.GymImagesComponent),
    data: { imageType: ImageTypes.ClassesScheduleImage, imageTypeName: ImageTypesName.classesScheduleImages }
  },
  { path: 'trans-images', loadComponent: () => import('./transformation-images/transformation-images.component').then(c => c.TransformationImagesComponent) },
  { path: 'gym-settings', loadComponent: () => import('./gym-settings/gym-settings.component').then(c => c.GymSettingsComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class AdministrationRoutingModule { }
