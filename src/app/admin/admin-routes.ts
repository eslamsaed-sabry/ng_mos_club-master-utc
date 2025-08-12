import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { branchResolver } from '../interceptors/branch.resolver';
import { SignalRService } from '../services/signal-r.service';


const routes: Routes = [
  {
    path: '', loadComponent: () => import('./admin.component').then(c => c.AdminComponent),
    children: [
      { path: 'members', loadComponent: () => import('./members/members.component').then(c => c.MembersComponent) },
      { path: 'memberships', loadComponent: () => import('./members/memberships/memberships.component').then(c => c.MembershipsComponent) },
      { path: 'form', loadChildren: () => import('./members/member-forms/member-forms-routing.module').then(m => m.MemberFormsRoutingModule)},
      { path: 'attendance', loadComponent: () => import('./members/attendance/attendance.component').then(c => c.AttendanceComponent) },
      { path: 'sessions', loadComponent: () => import('./members/sessions/sessions.component').then(c => c.SessionsComponent) },
      { path: 'debts', loadComponent: () => import('./members/debts/debts.component').then(c => c.DebtsComponent) },
      { path: 'debts-receipt', loadComponent: () => import('./members/debts/debt-print-receipt/debt-print-receipt.component').then(c => c.DebtPrintReceiptComponent) },
      { path: 'member-profile/:id', loadComponent: () => import('./members/member-profile-page/member-profile-page.component').then(c => c.MemberProfilePageComponent) },
      { path: 'attendance-monitoring', loadComponent: () => import('./members/attendance/attendance-monitoring/attendance-monitoring.component').then(c => c.AttendanceMonitoringComponent) },
      { path: 'calls', loadComponent: () => import('./members/calls/calls.component').then(c => c.CallsComponent) },
      { path: 'invitations', loadComponent: () => import('./members/invitations/invitations.component').then(c => c.InvitationsComponent) },
      { path: 'potential-members', loadComponent: () => import('./members/potential-members/potential-members.component').then(c => c.PotentialMembersComponent) },
      { path: 'tasks', loadComponent: () => import('./members/tasks/tasks.component').then(c => c.TasksComponent) },
      { path: 'freePrivateTraining', loadComponent: () => import('./members/free-private-training/free-private-training.component').then(c => c.FreePrivateTrainingComponent) },
      { path: 'branch-visit', loadComponent: () => import('./members/member-branch-visit/member-branch-visit.component').then(c => c.MemberBranchVisitComponent) },

      {
        path: 'reports',
        loadChildren: () => import('./reports/reports-routes').then(m => m.ReportsRoutingModule)
      }, {
        path: 'extra',
        loadChildren: () => import('./extra/extra-routes').then(m => m.ExtraRoutingModule)
      }, {
        path: 'scheduler',
        loadChildren: () => import('./schedular-table/schedular-table-routes').then(m => m.SchedularTableRoutingModule)
      }, {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule)
      }, {
        path: 'administration',
        loadChildren: () => import('./administration/administration-routes').then(m => m.AdministrationRoutingModule)
      }, {
        path: 'staff',
        loadChildren: () => import('./staff/staff-routes').then(m => m.StaffRoutingModule)
      }, {
        path: 'packages',
        loadChildren: () => import('./packages/packages-routes').then(m => m.PackagesRoutingModule)
      }, {
        path: 'accounts',
        loadChildren: () => import('./accounts/accounts-routes').then(m => m.AccountsRoutingModule)
      }, {
        path: 'management',
        loadChildren: () => import('./management/management-routes').then(m => m.ManagementRoutingModule)
      }, {
        path: 'public',
        loadChildren: () => import('../public/public-routes').then(m => m.PublicRoutingModule)
      }, {
        path: 'sales-schedule',
        loadChildren: () => import('./sales-schedule/sales-schedule-routes').then(m => m.SalesScheduleRoutingModule)
      }, {
        path: 'trainer-schedule',
        loadChildren: () => import('./trainer-schedule/trainer-schedule-routes').then(m => m.TrainerScheduleRoutingModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
    resolve: { post: branchResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [SignalRService]
})
export class AdminRoutingModule { }
