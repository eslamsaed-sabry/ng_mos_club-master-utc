import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadComponent: () => import('./booking-list.component').then(c => c.BookingListComponent)  },
  { path: 'class/:classId', loadComponent: () => import('./single-booking-list/single-booking-list.component').then(c => c.SingleBookingListComponent)  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class BookingListRoutingModule { }
