import { Component, OnInit, Input, ViewChild, EventEmitter, Output, TemplateRef, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { dialogMemberInvitationData, InvitationFilter, Invitee, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { InvitationFormComponent } from './invitation-form/invitation-form.component';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AttachmentsComponent } from 'src/app/shared/attachments/attachments.component';
import { AttachmentContextTypeId } from 'src/app/models/enums';
import { dialogAttachmentData } from 'src/app/models/staff.model';
import { AttachmentModalFormComponent } from 'src/app/shared/attachments/attachment-modal-form/attachment-modal-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { AttachmentsComponent as AttachmentsComponent_1 } from '../../../shared/attachments/attachments.component';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InvitationFiltersComponent } from './invitation-filters/invitation-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleDirective } from '../../../directives/role.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RoleAttrDirective } from 'src/app/directives/role-attr.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-invitations',
    templateUrl: './invitations.component.html',
    styleUrls: ['./invitations.component.scss'],
    imports: [MatSidenavModule, NgStyle, MatButtonModule, MatIconModule, RoleDirective, MatProgressSpinnerModule, BidiModule, InvitationFiltersComponent, MatTableModule, MatSortModule, RouterLink, MatMenuModule, MatPaginatorModule, AttachmentsComponent_1, DatePipe, GenderPipe, TranslateModule, RoleAttrDirective]
})
export class InvitationsComponent implements OnInit {
  @ViewChild('attachmentsModal') attachmentsModal: TemplateRef<any>;
  @ViewChild(AttachmentsComponent) attachmentsComp: AttachmentsComponent;
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  invitations: Invitee[] = [];
  @Input() member: Member;
  @Input() membershipId: number;
  dataSource: MatTableDataSource<Invitee>;
  displayedColumns: string[] = [
    'creationDate',
    'memberContractNo',
    // 'memberAccessCode',
    'memberPhoneNumber',
    'memberName',
    'guestEnglishName',
    // 'guestArabicName',
    'guestPhoneNumber',
    'guestGender',
    'salesName',
    'actions'
    // 'username'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  phoneModalData: Invitee = {} as Invitee;
  totalElements: number;
  page: number = 0;
  width = screen.width;
  filters: InvitationFilter = new InvitationFilter();
  loading: boolean;
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  selectedInvitation: Invitee;
  contextTypeId = AttachmentContextTypeId.INVITATION;

  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  constructor() { }

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as InvitationFilter;
        this.page = Math.floor(this.filters.skipCount! / this.filters.takeCount!);
      }
    });

    this.getInvitations();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getInvitations();
  }

  getExportedData() {
    this.loading = true;
    let newFilters = { ...this.filters };
    delete newFilters.skipCount;
    delete newFilters.takeCount;
    let props = {
      ...newFilters,
      showToastr: 'false',
      showSpinner: 'false'
    }

    this.memberService.exportInvitations(props).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.data) {
          window.open(this.proxyUrl + res.data)
        }
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  getInvitations() {
    this.memberService.getInvitations(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.invitations = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.invitations);
        this.dataSource.sort = this.sort;
      }
    })
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;

    this.filters.skipCount = e.pageIndex * this.filters.takeCount!;
    this.filters.takeCount = e.pageSize;
    this.router.navigate([], {
      queryParams: {
        skipCount: this.filters.skipCount,
        takeCount: this.filters.takeCount,
        page: this.page
      },
      queryParamsHandling: 'merge'
    });

    this.commonService.setRouteFilters(this.filters);
    this.getInvitations();
  }

  addInvitation() {
    let data = {} as dialogMemberInvitationData;
    data.type = 'addInvitation';
    data.hideSales = false;
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
      data: { mainTitle: this.translate.instant('members.msgToDeletedInvitation') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteInvitation(invitation);
      }
    });
  }

  onAttachments(invitation: Invitee) {
    this.selectedInvitation = invitation;
    this.dialog.open(this.attachmentsModal, {
      width: '800px',
      autoFocus: false
    });
  }

  addAttachment() {
    let data: dialogAttachmentData = {} as dialogAttachmentData;
    data.contextId = this.selectedInvitation.id;
    data.contextTypeId = this.contextTypeId
    let dialogRef = this.dialog.open(AttachmentModalFormComponent, {
      maxHeight: '80vh',
      width: '300px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.attachmentsComp.getAttachments();
      }
    });
  }

  confirm(data: Invitee) {
    this.memberService.confirmInvitation(data.id).subscribe({
      next: (res) => {
        this.getInvitations();
      }
    })
  }

  openPhonePopup(data: Invitee) {
    this.phoneModalData = data;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }

}
