import { Component, OnInit, ViewChild, TemplateRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { IMemberPhotoDialog, SearchConfig } from 'src/app/models/common.model';
import { CardStyle, Redirection, Theme } from 'src/app/models/enums';
import { Attendance, FullMember, Member } from 'src/app/models/member.model';
import { IAuthorizedUser, User } from 'src/app/models/user.model';
import { BrandService } from 'src/app/services/brand.service';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { AdvancedSearchComponent } from 'src/app/shared/advanced-search/advanced-search.component';
import { PhotoCompareComponent } from 'src/app/shared/photo-compare/photo-compare.component';
import { MembershipStatusPipe } from '../../../../pipes/membership-status.pipe';
import { CheckedInMembersComponent } from '../checked-in-members/checked-in-members.component';
import { MemberNotesComponent } from '../../notes/member-notes/member-notes.component';
import { BenefitsListComponent } from '../../benefits-list/benefits-list.component';
import { AttendanceComponent } from '../attendance.component';
import { SingleMemberMembershipsComponent } from '../../memberships/single-member-memberships/single-member-memberships.component';
import { MatIconModule } from '@angular/material/icon';
import { MemberPersonalCardComponent } from '../../member-personal-card/member-personal-card.component';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdvancedSearchComponent as AdvancedSearchComponent_1 } from '../../../../shared/advanced-search/advanced-search.component';

@Component({
  selector: 'app-attendance-monitoring',
  templateUrl: './attendance-monitoring.component.html',
  styleUrls: ['./attendance-monitoring.component.scss'],
  imports: [AdvancedSearchComponent_1, MatCheckboxModule, FormsModule, MatButtonModule, MemberPersonalCardComponent, NgClass, MatIconModule, SingleMemberMembershipsComponent, AttendanceComponent, BenefitsListComponent, MemberNotesComponent, CheckedInMembersComponent, MembershipStatusPipe, TranslateModule]
})
export class AttendanceMonitoringComponent implements OnInit {
  @ViewChild('searchSelector') searchSelector: AdvancedSearchComponent;
  @ViewChild('notesModal') notesModal: TemplateRef<any>;;
  @ViewChild('checkedInModal') checkedInModal: TemplateRef<any>;
  private common = inject(CommonService);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  public signalR = inject(SignalRService);
  private brandService = inject(BrandService);

  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser') || '');
  cardStyle = CardStyle;
  selectedMember: FullMember | null;
  autoAddAttendance: boolean = true;
  searchConfig: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Page,
    parentClass: 'attendance-advanced-search'
  };
  branchName: string;
  notFound: boolean = false;
  memberAttendance: Attendance[];
  notesLength: number;
  constructor() {
    this.common.updateMenuStatus(false)
  }

  ngOnInit(): void {
    this.getBranch();

    this.route.queryParams.subscribe((params: any) => {
      if (Object.keys(params).length) {
        this.selectedMember = null;
      }
      if (params.code) {
        let m = {} as Member;
        m.id = params.code;
        this.getFullMember(m,false);
      }
      if (params.id) {
        let m = {} as Member;
        m.id = params.id;
        m.nameAR = params.id;
        this.getFullMember(m, !!params.attend);
      }
      // setTimeout(() => {
      //   this.clearRouteParams();
      // }, 500);
    })
  }

  clearRouteParams() {
    this.router.navigate([], {
      queryParams: {
        'id': null,
        'code': null,
        'attend':null
      },
      queryParamsHandling: 'merge'
    })
  }

  getFullMember(m: Member, autoAddAtt = this.autoAddAttendance) {
    this.selectedMember = null;

    let props: any = {
      searchText: m.id,
      searchMethod: m.nameAR ? 0 : 1,
      includeSearchByPhone: true,
      autoAddAttendance: autoAddAtt,
      branchId: this.brandService.currentBranch.id
    };

    this.memberService.getFullMemberData(props).subscribe({
      next: (res: any) => {
        if (!res.data.personalData) {
          this.notFound = true;
          this.searchSelector.searchKeyword = '';
        } else {
          const _status = res.data.membershipMatchedData ? res.data.membershipMatchedData.statusCode : 0;
          this.signalR.playNotification(_status === 1);
          this.selectedMember = res.data;
          this.notFound = false;
          this.searchSelector.searchKeyword = '';
          this.notesLength = this.selectedMember!.notes.filter(el => !el.isDismissed).length;
          this.getUnlockDoor();
          this.clearRouteParams();
          // if (res.data.membershipMatchedData)
          //   this.getMemberAttendance(this.selectedMember?.membershipMatchedData.membershipId)
        }
      },
    });
  }

  getUnlockDoor() {
    if (this.selectedMember!.membershipMatchedData.statusCode === 1) {
      if (this.user.gateUrl) {
        this.memberService.unlockGate(this.user.gateUrl).subscribe({
          next: (res) => {
            console.warn('Gate is unlocked.')
          }
        });
      }
    }
  }

  getMemberAttendance(membershipId: number) {
    this.memberService.getMembersAttendance({ membershipId: membershipId }).subscribe({
      next: (res) => {
        this.memberAttendance = res.data;
      }
    })
  }

  showNotes() {
    this.dialog.open(this.notesModal, {
      width: '800px',
      autoFocus: false
    });
  }

  onImgCompare(member: Member) {
    let data: IMemberPhotoDialog = {
      confirmedPhoto: member.confirmedPhoto,
      newPhoto: member.photo,
      memberId: member.id
    };

    let dialogRef = this.dialog.open(PhotoCompareComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.selectedMember!.personalData.isMemberChangedThePhoto = false
      }
    });
  }

  pinPage() {
    this.signalR.pinned = !this.signalR.pinned
  }

  getCheckedInMembers() {
    this.dialog.open(this.checkedInModal, {
      maxHeight: '90vh'
    });
  }

  getBranch() {
    this.branchName = this.brandService.currentBranch.name;
  }
}
