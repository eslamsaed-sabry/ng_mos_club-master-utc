import { AsyncPipe, DatePipe, NgStyle } from '@angular/common';
import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map, switchMap } from 'rxjs';
import { HidePhoneNumberDirective } from 'src/app/directives/hide-phone-number.directive';
import { RoleDirective } from 'src/app/directives/role.directive';
import { FreeBenefitFilters, IBenefitReservation, IFreeBenefit } from 'src/app/models/extra.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ExtraService } from 'src/app/services/extra.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-benefits-reservations',
  imports: [TranslateModule, MatDatepickerModule, MatInputModule, FormsModule,
    AsyncPipe, MatPaginatorModule, MatIcon, NgStyle, DatePipe, RouterLink, HidePhoneNumberDirective,
    MatButtonModule, RoleDirective],
  templateUrl: './benefits-reservations.component.html'
})
export class BenefitsReservationsComponent {
  paginator = viewChild<MatPaginator>('paginator');
  private extraService = inject(ExtraService);
  filters: FreeBenefitFilters = new FreeBenefitFilters();
  private destroyRef = inject(DestroyRef);
  refresh$ = signal(0);
  freeBenefits: IFreeBenefit[] = [];
  totalElements: number;
  benefits$ = toObservable(this.refresh$).pipe(switchMap(() => this.extraService.getBenefitsReservations(this.filters).pipe(map(res => {
    this.totalElements = res.totalCount;
    const _data = res.data.map((b: IBenefitReservation) => ({ ...b, memberPhoto: b.memberPhoto ? this.proxyUrl + '/Images/' + b.memberPhoto : 'assets/images/avatar.png' }));
    return _data as IBenefitReservation[];
  }))));
  page = 0;
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  refresh() {
    this.refresh$.update(c => c + 1);
  }

  confirmReservation(reservationId: number) {
    const _dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { mainTitle: this.translate.instant('extra.msgToConfirmReservation') }
    })

    _dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'yes') {
        this.extraService.confirmBenefitReservation(reservationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            this.refresh();
          }
        })
      }
    })
  }

  deleteReservation(reservationId: number) {
    const _dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { mainTitle: this.translate.instant('extra.msgToDeleteReservation') }
    })

    _dialogRef.afterClosed().subscribe(res => {
      if (res.status === 'yes') {
        this.extraService.deleteBenefitReservation(reservationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            this.refresh();
          }
        })
      }
    })
  }

  onPaginationChange(e: PageEvent) {
    this.filters.takeCount = e.pageSize;
    this.filters.skipCount = e.pageIndex * e.pageSize;
    this.refresh();
   }
}
