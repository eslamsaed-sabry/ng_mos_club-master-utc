import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataListTypeName, LookupType, PageID, RangePercentageSymbol, RequiredFieldPage } from 'src/app/models/enums';

const routes: Routes = [
  { path: 'announcements', loadComponent: () => import('./announcements/announcements.component').then(c => c.AnnouncementsComponent) },
  {
    path: 'salesRanges', loadComponent: () => import('./ranges/ranges.component').then(c => c.RangesComponent), data:
      { dataType: RangePercentageSymbol.SALES_PERSON }
  },
  {
    path: 'salesPercentages', loadComponent: () => import('./percentages/percentages.component').then(c => c.PercentagesComponent), data:
      { dataType: RangePercentageSymbol.SALES_PERSON }
  },
  {
    path: 'salesTargets', loadComponent: () => import('./targets/targets.component').then(c => c.TargetsComponent), data:
      { dataType: RangePercentageSymbol.SALES_PERSON }
  },
  {
    path: 'coachRanges', loadComponent: () => import('./ranges/ranges.component').then(c => c.RangesComponent), data:
      { dataType: RangePercentageSymbol.COACH }
  },
  {
    path: 'coachPercentages', loadComponent: () => import('./percentages/percentages.component').then(c => c.PercentagesComponent), data:
      { dataType: RangePercentageSymbol.COACH }
  },
  {
    path: 'coachTargets', loadComponent: () => import('./targets/targets.component').then(c => c.TargetsComponent), data:
      { dataType: RangePercentageSymbol.COACH }
  },
  { path: 'session-types', loadComponent: () => import('./session-types/session-types.component').then(c => c.SessionTypesComponent) },
  { path: 'gym-rules', loadComponent: () => import('./gym-rules/gym-rules.component').then(c => c.GymRulesComponent) },
  { path: 'benefits-types', loadComponent: () => import('./benefits-types/benefits-types.component').then(c => c.BenefitsTypesComponent) },
  { path: 'faqs', loadComponent: () => import('./faqs/faqs.component').then(c => c.FaqsComponent) },
  { path: 'packages-commissions', loadComponent: () => import('./custom-packages-commissions/custom-packages-commissions.component').then(c => c.CustomPackagesCommissionsComponent) },
  { path: 'notifications-Templates', loadComponent: () => import('./notifications-template/notifications-template.component').then(c => c.NotificationsTemplateComponent) },
  { path: 'closing-Transactions', loadComponent: () => import('./closing-transactions/closing-transactions.component').then(c => c.ClosingTransactionsComponent) },
  { path: 'class-rooms', loadComponent: () => import('./class-rooms/class-rooms.component').then(c => c.ClassRoomsComponent) },
  {
    path: 'classes-types', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.ClassesTypes, typeName: DataListTypeName.CLASSES_TYPES }
  },
  {
    path: 'gym-sections', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.GymSections, typeName: DataListTypeName.GYM_SECTIONS }
  },
  {
    path: 'sources-of-knowledge', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.SourceOfKnowledge, typeName: DataListTypeName.SOURCES_OF_KNOWLEDGE }
  },
  {
    path: 'owners', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.Owners, typeName: DataListTypeName.OWNERS }
  },
  {
    path: 'nationalities', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.Nationalities, typeName: DataListTypeName.NATIONALITIES }
  },
  {
    path: 'regions', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.Regions, typeName: DataListTypeName.REGIONS }
  },
  {
    path: 'visa-types', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.VisaTypes, typeName: DataListTypeName.VISA_TYPES }
  },
  {
    path: 'job-titles', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.JobTitle, typeName: DataListTypeName.JOB_TITLES }
  },
  {
    path: 'call-feedbacks', loadComponent: () => import('./calls-feedback/calls-feedback.component')
      .then(c => c.CallsFeedbackComponent)
  },
  {
    path: 'class-cancellation-reasons', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.ClassCancellationReasons, typeName: DataListTypeName.CLASS_CANCELLATION_REASONS }
  },
  {
    path: 'membership-cancellation-reasons', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.MembershipCancellationReasons, typeName: DataListTypeName.MEMBERSHIP_CANCELLATION_REASONS }
  },
  {
    path: 'interest-percentages', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.InterestPercentage, typeName: DataListTypeName.INTEREST_PERCENTAGES }
  },
  {
    path: 'lost-category', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.LostCategory, typeName: DataListTypeName.LOST_CATEGORY }
  },
  {
    path: 'gym-locations', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.LocationsInsideGym, typeName: DataListTypeName.LOCATIONS_INSIDE_GYM }
  },
  {
    path: 'machine-models', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.MachineModels, typeName: DataListTypeName.MACHINE_MODELS }
  },
  {
    path: 'expenses-types', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.ExpensesTypes, typeName: DataListTypeName.EXPENSES_TYPES }
  },
  {
    path: 'package-type', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.PackageType, typeName: DataListTypeName.PACKAGE_TYPE }
  },
  {
    path: 'member-level', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.MemberLevel, typeName: DataListTypeName.MEMBER_LEVEL }
  },
  {
    path: 'member-goals', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.MemberGoals, typeName: DataListTypeName.MEMBER_GOALS }
  },
  {
    path: 'suit-size', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.SuitSize, typeName: DataListTypeName.SUIT_SIZE }
  },
  {
    path: 'workout-types', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.WorkOutTypes, typeName: DataListTypeName.WORKOUT_TYPES }
  },
  {
    path: 'maintenance-types', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.MaintenanceTypes, typeName: DataListTypeName.MAINTENANCE_TYPES }
  },
  {
    path: 'reservation-types', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.ReservationTypes, typeName: DataListTypeName.RESERVATION_TYPES }
  },
  {
    path: 'class-genres', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.ClassGenres, typeName: DataListTypeName.CLASS_GENRES }
  },
  {
    path: 'class-programs', loadComponent: () => import('./data-list/data-list.component').then(c => c.DataListComponent), data:
      { dataType: LookupType.ClassPrograms, typeName: DataListTypeName.CLASS_PROGRAMS }
  },
  { path: 'appHomeScreenSections', loadComponent: () => import('./app-home-screen-sections/app-home-screen-sections.component').then(c => c.AppHomeScreenSectionsComponent) },
  { path: 'news', loadComponent: () => import('./news/news.component').then(c => c.NewsComponent), data: { titleKey: 'navigation.news', pageID: PageID.NEWS } },
  { path: 'offers', loadComponent: () => import('./news/news.component').then(c => c.NewsComponent), data: { titleKey: 'navigation.offers', pageID: PageID.OFFERS } },
  { path: 'events', loadComponent: () => import('./news/news.component').then(c => c.NewsComponent), data: { titleKey: 'navigation.events', pageID: PageID.EVENTS } },
  { path: 'member-profile-fields', loadComponent: () => import('./required-fields/required-fields.component').then(c => c.RequiredFieldsComponent), data: { titleKey: 'navigation.requiredFieldsMemberProfile', pageName: RequiredFieldPage.MEMBER_PROFILE } },
  { path: 'possible-members-fields', loadComponent: () => import('./required-fields/required-fields.component').then(c => c.RequiredFieldsComponent), data: { titleKey: 'navigation.potMembers', pageName: RequiredFieldPage.POSSIBLE_MEMBERS } },
  {
    path: 'member-notifications',
    loadChildren: () => import('./member-notifications/member-notifications.module').then(m => m.MemberNotificationsModule)
  },
  { path: 'machines', loadComponent: () => import('./machines/machines.component').then(c => c.MachinesComponent) },
  { path: 'exercises', loadComponent: () => import('./exercises/exercises.component').then(c => c.ExercisesComponent) },
  { path: 'event-bookings/:eventId', loadComponent: () => import('./event-bookings/event-bookings.component').then(c => c.EventBookingsComponent) },
  { path: 'instructors-Classes-Prices', loadComponent: () => import('./instructors-classes-prices/instructors-classes-prices.component').then(c => c.InstructorsClassesPricesComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ManagementRoutingModule { }
