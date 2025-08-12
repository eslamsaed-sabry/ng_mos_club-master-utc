import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ITableActionEvent, ITableColumn, MAT_TABLE_COL_TYPE, MaterialTableComponent } from 'src/app/shared/material-table/material-table.component';
import { EventBookingFormComponent } from './event-booking-form/event-booking-form.component';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagementService } from 'src/app/services/management.service';
import { AsyncPipe } from '@angular/common';
import { forkJoin, map, mergeMap, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { IEventBooking } from 'src/app/models/management.model';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-event-bookings',
  imports: [TranslateModule, MaterialTableComponent, MatIcon, MatButton, AsyncPipe],
  templateUrl: './event-bookings.component.html'
})
export class EventBookingsComponent {
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private managementService = inject(ManagementService);
  private destroyRef = inject(DestroyRef);
  event: IEventBooking | null;
  refresh$ = signal(0);
  eventId = +this.route.snapshot.params['eventId'];
  id = input<number | null>(null);
  eventBooking$ = toObservable(this.refresh$).pipe(
    switchMap(() =>
      forkJoin({
        event: this.managementService.getSingleEvent(this.eventId),
        bookings: this.managementService.getEventBookings(this.eventId)
      })
    ),
    tap(({ event }) => this.event = event.data[0]),
    map(({ bookings }) => bookings)
  );
  constructor() {
    effect(() => {
      if (this.id()) {
        this.eventId = this.id()!;
      }
    })
  }

  displayedCols: ITableColumn[] = [
    { label: this.translate.instant('members.creationDate'), key: 'creationDate', colType: MAT_TABLE_COL_TYPE.DATE },
    { label: this.translate.instant('members.memberName'), key: 'memberName', iconClass: 'mo-text-blue-500 hover:mo-underline' },
    { label: this.translate.instant('members.phone'), key: 'memberPhone' },
    { label: this.translate.instant('members.contractNo'), key: 'memberContractNo' },
    { label: this.translate.instant('members.paymentDate'), key: 'paymentDate', colType: MAT_TABLE_COL_TYPE.DATE },
    { label: this.translate.instant('receiptPrint.amountPaidCash'), key: 'cashAmountPaid' },
    { label: this.translate.instant('receiptPrint.amountPaidVisa'), key: 'visaAmountPaid' },
    { label: this.translate.instant('members.visaType'), key: 'visaTypeName' },
    { label: this.translate.instant('members.delete'), key: 'action', icon: 'delete', iconClass: 'mo-text-red-500' }
  ];

  refresh() {
    this.refresh$.update(c => c + 1);
  }

  addBooking() {
    const dialogRef = this.dialog.open(EventBookingFormComponent, {
      width: '600px',
      data: this.event
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'success') {
        this.refresh();
      }
    })
  }

  getTableAction(e: ITableActionEvent<IEventBooking>) {
    const booking = e.data as IEventBooking;
    switch (e.actionName) {
      case 'action':
        this.onDeleteBooking(booking);
        break;

      default:
        this.router.navigate(['/admin/member-profile', booking.memberId])
        break;
    }
  }

  onDeleteBooking(booking: IEventBooking) {
    const _dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { mainTitle: this.translate.instant('accounts.msgToDeletedEventBooking') }
    });

    _dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'yes') {
        this.managementService.deleteMemberEventBooking(booking.eventId, booking.memberId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            this.refresh();
          }
        })
      }
    })
  }
}
