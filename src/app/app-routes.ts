import { Routes } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserPermissionsService } from './services/user-permissions.service';

const routeConfig: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routes').then(m => m.AdminRoutingModule),
    canActivate: [AuthGuardService, UserPermissionsService]
  }, {
    path: 'auth',
    loadChildren: () => import('./auth/auth-routes').then(m => m.AuthRoutingModule)
  }, {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  },
  { path: '**', component: NotFoundComponent }
];

export default routeConfig;

