import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardStyle } from 'src/app/models/enums';
import { FullMember, BenefitSession, Benefit } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { MemberBenefitsSessionsComponent } from '../benefits-sessions/member-benefits-sessions/member-benefits-sessions.component';
import { MemberFreezesComponent } from '../freezes/member-freezes/member-freezes.component';
import { MemberInvitationsComponent } from '../invitations/member-invitations/member-invitations.component';


@Component({
    selector: 'app-benefits-list',
    templateUrl: './benefits-list.component.html',
    styleUrls: ['./benefits-list.component.scss'],
    imports: [MemberInvitationsComponent, MemberFreezesComponent, MemberBenefitsSessionsComponent]
})
export class BenefitsListComponent implements OnInit {
  @Input() selectedMember: FullMember;
  @Input() style: string = CardStyle.standard;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @ViewChild('invitationsModal') invitationsModal: TemplateRef<any>;
  @ViewChild('freezeModal') freezeModal: TemplateRef<any>;
  @ViewChild('sessionModal') sessionModal: TemplateRef<any>;
  sessions: BenefitSession[] = [];
  benefit: Benefit;
  symbol: string;
  constructor(private dialog: MatDialog, private memberService: MemberService) { }

  ngOnInit(): void {
  }

  getSessions(onRefresh = false) {
    let membershipId = this.selectedMember.membershipMatchedData.membershipId;
    this.memberService.getBenefitSessions(membershipId, this.benefit.id).subscribe({
      next: (res) => {
        this.sessions = res.data;
        if (!onRefresh) {
          this.dialog.open(this.sessionModal, {
            autoFocus: false,
            maxHeight: '90vh'
          });
        }
      }
    })
  }

  onBenefitClick(benefit: Benefit) {
    switch (benefit.symbol) {
      case 'Invitations':
        this.dialog.open(this.invitationsModal, {
          autoFocus: false,
          maxHeight: '90vh'
        });
        break;
      case 'FreezeCount':
        this.symbol = "FreezeCount";
        this.dialog.open(this.freezeModal, {
          autoFocus: false,
          maxHeight: '90vh'
        });
        break;
      case 'MedicalFreeze':
        this.symbol = "MedicalFreeze";
        this.dialog.open(this.freezeModal, {
          autoFocus: false,
          maxHeight: '90vh'
        });
        break;

      default:
        this.benefit = benefit;
        this.getSessions();
        break;
    }
  }

}
