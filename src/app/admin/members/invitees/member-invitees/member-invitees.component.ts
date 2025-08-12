import { Component, OnInit, Input, ViewChild, EventEmitter, Output, AfterViewInit, OnChanges, SimpleChanges, inject, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { dialogMemberData, Invitee, Member } from 'src/app/models/member.model';
import { InviteeFormComponent } from '../invitee-form/invitee-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { GenderPipe } from '../../../../pipes/gender.pipe';
import { DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RoleAttrDirective } from 'src/app/directives/role-attr.directive';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: 'app-member-invitees',
    templateUrl: './member-invitees.component.html',
    styleUrls: ['./member-invitees.component.scss'],
    imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, GenderPipe, TranslateModule, RoleAttrDirective]
})
export class MemberInviteesComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() invitees: Invitee[] = [];
  @Input() member: Member;
  @Input() isInvites: boolean;
  @Input() isInvitedBy: boolean;
  phoneModalData: Invitee = {} as Invitee;
  phoneModalDataForMember: boolean = true;
  dataSource: MatTableDataSource<Invitee>;
  displayedColumns: string[] = [
    'creationDate',
    'memberContractNo',
    'memberAccessCode',
    'memberPhoneNumber',
    'memberName',
    'guestEnglishName',
    'guestArabicName',
    'guestPhoneNumber',
    'guestGender',
    'salesName',
    'username',
    'confirm'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dialog = inject(MatDialog);
  private memberService = inject(MemberService);

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.invitees);
    if (this.isInvites) {
      this.displayedColumns = [
        'creationDate',
        'guestPhoneNumber',
        'guestEnglishName',
        'username',
        'confirm']
    }
    else if (this.isInvitedBy) {
      this.displayedColumns = [
        'creationDate',
        'memberContractNo',
        'memberPhoneNumber',
        'memberName',
        'salesName',
        'username',
        'confirm']
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['invitees'].firstChange) {
      this.dataSource = new MatTableDataSource(this.invitees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // addInvitation() {
  //   let data = {} as dialogMemberData;
  //   data.type = 'standalone';
  //   data.memberData = this.member;
  //   let dialogRef = this.dialog.open(InviteeFormComponent, {
  //     maxHeight: '80vh',
  //     width: '700px',
  //     data: data,
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && result.action === 'success') {
  //        this.refresh.emit();
  //     }
  //   });
  // }

  confirm(data: Invitee) {
    this.memberService.confirmInvitation(data.id).subscribe({
      next: (res) => {
        this.refresh.emit();
      }
    })
  }


  openPhonePopup(data: Invitee, kind: string) {
    this.phoneModalData = data;
    this.phoneModalDataForMember = kind == "member" ? true : false;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }

}
