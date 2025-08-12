import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExtraService } from 'src/app/services/extra.service';


const routes = [
  { path: 'cafeteria', loadComponent: () => import('./cafeteria/cafeteria.component').then(c => c.CafeteriaComponent) },
  { path: 'receipts', loadComponent: () => import('./receipts/receipts.component').then(c => c.ReceiptsComponent) },
  { path: 'free-benefits', loadComponent: () => import('./free-benefits/free-benefits.component').then(c => c.FreeBenefitsComponent) },
  { path: 'approve-decline', loadComponent: () => import('./approve-decline/approve-decline.component').then(c => c.ApproveDeclineComponent) },
  { path: 'complaints', loadComponent: () => import('./complaints/complaints.component').then(c => c.ComplaintsComponent) },
  { path: 'requests', loadComponent: () => import('./requests/requests.component').then(c => c.RequestsComponent) },
  { path: 'feedbacks', loadComponent: () => import('./feedbacks/feedbacks.component').then(c => c.FeedbacksComponent) },
  { path: 'lostItems', loadComponent: () => import('./lost-items/lost-items.component').then(c => c.LostItemsComponent) },
  { path: 'machine-maintenance', loadComponent: () => import('./machine-maintenance/machine-maintenance.component').then(c => c.MachineMaintenanceComponent) },
  { path: 'workouts', loadComponent: () => import('./workouts/workouts.component').then(c => c.WorkoutsComponent) },
  { path: 'workouts/members/:workoutId', loadComponent: () => import('./workouts/workout-members/workout-members.component').then(c => c.WorkoutMembersComponent) },
  { path: 'workouts/exercises/:workoutId', loadComponent: () => import('./workouts/workout-exercises/workout-exercises.component').then(c => c.WorkoutExercisesComponent) },
  { path: 'membersTrainingNotes', loadComponent: () => import('./members-training-notes/members-training-notes.component').then(c => c.MembersTrainingNotesComponent) },
  { path: 'reminders', loadComponent: () => import('./reminders/reminders.component').then(c => c.RemindersComponent) },
  { path: 'benefits-reservations', loadComponent: () => import('./benefits-reservations/benefits-reservations.component').then(c => c.BenefitsReservationsComponent) },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [ExtraService]
})
export class ExtraRoutingModule { }
