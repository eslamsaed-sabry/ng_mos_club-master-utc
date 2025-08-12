
import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: 'app-notification-batch-data-list',
    imports: [TranslateModule, MatDialogModule, MatPaginatorModule],
    templateUrl: './notification-batch-data-list.component.html'
})
export class NotificationBatchDataListComponent implements OnInit {
  private memberService = inject(MemberService);
  public dialogRef = inject(MatDialogRef<NotificationBatchDataListComponent>);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  pageNumber = 0;
  pageSize = 10;
  members!: Member[];
  totalElements!: number;
  constructor(@Inject(MAT_DIALOG_DATA) public batchId: number) { }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  ngOnInit(): void {
    this.getBatchData();
  }

  getBatchData() {
    this.memberService.getMembersRelatedToBatch(this.batchId, this.pageNumber, this.pageSize).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.members = res.data;
        this.totalElements = res.totalCount;
      }
    })
  }

  onPaginationChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getBatchData();
  }

  onSelectMember(m: Member) {
    this.dismiss();
    this.router.navigate(['/admin/member-profile', m.id]);
  }
}
