import { Component, OnInit, Input, ViewChild, EventEmitter, Output, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { dialogMemberInvitationData, InvitationFilter, Invitee, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { InvitationFormComponent } from '../invitation-form/invitation-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GenderPipe } from '../../../../pipes/gender.pipe';
import { DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../../directives/role.directive';
import { GymConfig } from 'src/app/models/enums';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-member-invitations',
    templateUrl: './member-invitations.component.html',
    styleUrls: ['./member-invitations.component.scss'],
    imports: [RoleDirective, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, GenderPipe, TranslateModule]
})
export class MemberInvitationsComponent implements OnInit {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  invitations: Invitee[] = [];
  @Input() member: Member;
  @Input() membershipId: number;
  dataSource: MatTableDataSource<Invitee>;
  displayedColumns: string[] = [
    'creationDate',
    'memberContractNo',
    'memberAccessCode',
    'memberPhoneNumber',
    'memberName',
    'guestEnglishName',
    // 'guestArabicName',
    'guestPhoneNumber',
    'guestGender',
    'salesName',
    'delete'
    // 'username'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private destroyRef = inject(DestroyRef);

  constructor(public dialog: MatDialog, private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getInvitations();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getInvitations() {
    let props: InvitationFilter = new InvitationFilter();
    props.membershipId = this.membershipId;
    this.memberService.getInvitations(props).subscribe({
      next: (res) => {
        this.invitations = res.data;
        this.dataSource = new MatTableDataSource(this.invitations);
        this.dataSource.sort = this.sort;
      }
    })
  }

  addInvitation() {
    this.memberService.getGymConfig(GymConfig.RotateInvitation).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        let data = {} as dialogMemberInvitationData;
        data.type = 'addInvitation';
        data.memberData = this.member;
        data.membershipId = this.membershipId;
        data.hideSales = false;
        data.rotateInvitation = res.data == "true" ? true : false;
        let dialogRef = this.dialog.open(InvitationFormComponent, {
          maxHeight: '80vh',
          width: '750px',
          data: data,
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.action === 'success') {
            this.getInvitations();
            this.refresh.emit();
          }
        });
      }
    })
  }

  deleteInvitation(invitation: Invitee) {
    this.memberService.removeInvitation(invitation.id).subscribe({
      next: (res) => {
        this.getInvitations();
        this.refresh.emit();
      }
    })
  }

  onDeleteInvitation(invitation: Invitee) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('extra.msgToDeletedInvitation') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteInvitation(invitation);
      }
    });
  }


}
