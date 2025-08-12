import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BlockUserComponent } from 'src/app/admin/members/block-user/block-user.component';
import { CallFormComponent } from 'src/app/admin/members/calls/call-form/call-form.component';
import { ChangePasswordComponent } from 'src/app/admin/members/change-password/change-password.component';
import { NoteFormComponent } from 'src/app/admin/members/notes/note-form/note-form.component';
import { Member, dialogMemberData, dialogMemberReminder, styleMemberAction } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { MemberReminderFormComponent } from 'src/app/admin/members/member-reminder-form/member-reminder-form.component';
import { ITasks, dialogTasksData } from 'src/app/models/extra.model';
import { TasksFormComponent } from 'src/app/admin/members/tasks/tasks-form/tasks-form.component';
import { IMemberPhotoDialog } from 'src/app/models/common.model';
import { AttachmentContextTypeId } from 'src/app/models/enums';
import { dialogAttachmentData } from 'src/app/models/staff.model';
import { AttachmentModalFormComponent } from 'src/app/shared/attachments/attachment-modal-form/attachment-modal-form.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PhotoCompareComponent } from 'src/app/shared/photo-compare/photo-compare.component';
import { MatDialog } from '@angular/material/dialog';
import { Platform } from '@angular/cdk/platform';
import { AttachmentsComponent } from '../attachments/attachments.component';
import { RoleDirective } from '../../directives/role.directive';
import { RoleAttrDirective } from '../../directives/role-attr.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { Router } from '@angular/router';

@Component({
    selector: 'app-member-actions',
    templateUrl: './member-actions.component.html',
    styleUrls: ['./member-actions.component.scss'],
    imports: [MatButtonModule, MatMenuModule, MatIconModule, RoleAttrDirective, RoleDirective, AttachmentsComponent, TranslateModule]
})
export class MemberActionsComponent {
  @ViewChild('historyModal') historyModal: TemplateRef<any>;
  @ViewChild('attachmentsModal') attachmentsModal: TemplateRef<any>;

  @Input() member: Member;
  @Input() styleMember: styleMemberAction;
  @Output() onAction: EventEmitter<{ actionType: string, member: Member }> = new EventEmitter();
  imageLoader: boolean = true;
  public platform = inject(Platform);
  private router = inject(Router);

  private memberService = inject(MemberService);
  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);


  blockMember() {
    let dialogRef = this.dialog.open(BlockUserComponent, {
      maxHeight: '80vh',
      width: '400px',
      data: this.member,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.onAction.emit({ actionType: "block", member: this.member });
      }
    });
  }

  addCall() {
    let data = {} as dialogMemberData;
    data.type = 'addCall';
    data.memberData = this.member;
    let dialogRef = this.dialog.open(CallFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.onAction.emit({ actionType: "addCall", member: this.member });
      }
    });
  }

  changePassword() {
    let dialogRef = this.dialog.open(ChangePasswordComponent, {
      maxHeight: '80vh',
      width: '400px',
      data: this.member,
      autoFocus: false
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.status === 'success') {
    //     this.onAction.emit({ actionType: "changePW", member: this.member });
    //   }
    // });
  }

  memberHistory: string[];
  viewMemberHistory() {
    if (this.member.history)
      this.memberHistory = this.member.history
        .split('\r\n')
        .filter((el) => el.trim().length !== 0);
    else this.memberHistory = [];

    let dialogRef = this.dialog.open(this.historyModal, {
      width: '600px',
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.status === 'success') {
    //     this.onAction.emit({ actionType: "history", member: this.member });
    //   }
    // });
  }

  addNote() {
    let data = {} as dialogMemberData;
    data.type = 'addNote';
    data.memberData = this.member;
    let dialogRef = this.dialog.open(NoteFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.onAction.emit({ actionType: "addNote", member: this.member });
      }
    });
  }

  onAttachments() {
    let dialogRef = this.dialog.open(this.attachmentsModal, {
      width: '800px',
      autoFocus: false
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.status === 'success') {
    //     this.onAction.emit({ actionType: "attachments", member: this.member });
    //   }
    // });
  }

  addReminder() {
    let data = {} as dialogMemberReminder;
    data.type = 'add';
    data.memberData = this.member;
    data.dataType = "MEMBER";
    let dialogRef = this.dialog.open(MemberReminderFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.status === 'success') {
    //     this.onAction.emit({ actionType: "reminder", member: this.member });
    //   }
    // });
  }

  addTask() {
    let data = {} as dialogTasksData;
    data.type = 'add';
    data.memberData = this.member;
    data.task = {} as ITasks;
    data.task.memberId = this.member.id;

    let dialogRef = this.dialog.open(TasksFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.status === 'success') {
    //     this.onAction.emit({ actionType: "tasks", member: this.member });
    //   }
    // });
  }

  onImgCompare() {
    let data: IMemberPhotoDialog = {
      confirmedPhoto: this.member.confirmedPhoto,
      newPhoto: this.member.photo,
      memberId: this.member.id
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
        this.onAction.emit({ actionType: "photoCompare", member: this.member });
      }
    });
  }

  onDeleteMember() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedMember'), subTitle: `${this.member.nameEng} (${this.member.nameAR})` },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'yes') {
        this.deleteMember();
      }
    });
  }

  deleteMember() {
    this.memberService.deleteMember(this.member.id).subscribe({
      next: () => {
        this.onAction.emit({ actionType: "delete", member: this.member });
      }
    });
  }

  editMember(selectedTab: string = '') {
    this.router.navigate(['/admin/form/membership/edit'], {
      queryParams: { memberId: this.member.id }
    })
  }

  contextTypeId = AttachmentContextTypeId.MEMBERS;
  addAttachment() {
    let data: dialogAttachmentData = {} as dialogAttachmentData;
    data.contextId = this.member.id;
    data.contextTypeId = this.contextTypeId
    let dialogRef = this.dialog.open(AttachmentModalFormComponent, {
      maxHeight: '80vh',
      width: '300px',
      data: data,
      autoFocus: false
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.status === 'success') {
    //     this.onAction.emit({ actionType: "addAttachment", member: this.member });
    //   }
    // });
  }

  openWhatsapp() {
    let fullNumber = (this.member.countryCode ?? '') + '' + this.member.phoneNo;
    let url = this.platform.ANDROID || this.platform.IOS ? 'https://wa.me/' : 'https://web.whatsapp.com/send?phone=';
    window.open(`${url}${fullNumber}`, '_blank');
  }

  directCall() {
    window.location.href = `tel:${this.member.phoneNo}`;
  }
}
