import { Component, OnInit, Input, inject } from '@angular/core';
import { IExpenses } from 'src/app/models/accounts.model';
import { AttachmentContextTypeId } from 'src/app/models/enums';
import { Invitee, IPossibleMember, Member } from 'src/app/models/member.model';
import { Attachment, IStaff, dialogAttachmentData } from 'src/app/models/staff.model';
import { CommonService } from 'src/app/services/common.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AttachmentModalFormComponent } from './attachment-modal-form/attachment-modal-form.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { RoleAttrDirective } from '../../directives/role-attr.directive';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-attachments',
    templateUrl: './attachments.component.html',
    styleUrls: ['./attachments.component.scss'],
    imports: [MatButtonModule, RoleAttrDirective, MatIconModule, NgStyle, MatTooltipModule, TranslateModule]
})
export class AttachmentsComponent implements OnInit {
  @Input() staff: Partial<IStaff | IExpenses | IPossibleMember | Invitee | Member>;
  @Input() contextTypeId: number = AttachmentContextTypeId.STAFF;
  @Input() showAddBtn = false;
  attachments: Attachment[] = [];
  public appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  dialog = inject(MatDialog);
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getAttachments();
  }

  getAttachments() {
    let props = {
      contextId: this.staff.id,
      contextTypeId: this.contextTypeId
    }
    this.commonService.getAttachments(props).subscribe({
      next: (res) => {
        this.attachments = res.data;
      }
    })
  }

  downloadAttachment(attachment: Attachment) {
    this.commonService.downloadAttachment(attachment.id).subscribe({
      next: (res) => {
        const linkSource = `data:${res.contentType};base64,${res.fileContents}`;
        let a = document.createElement("a");
        a.href = linkSource;
        a.download = res.fileDownloadName;
        a.click();
        document.body.removeChild(a);
      }
    })
  }

  deleteAttachment(attachment: Attachment) {
    this.commonService.deleteAttachment(attachment.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.attachments = this.attachments.filter(a => a.id != attachment.id);
        }
      }
    })
  }

  addAttachment() {
    let data: dialogAttachmentData = {} as dialogAttachmentData;
    data.contextId = this.staff.id;
    data.contextTypeId = this.contextTypeId
    let dialogRef = this.dialog.open(AttachmentModalFormComponent, {
      maxHeight: '80vh',
      width: '300px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getAttachments();
      }
    });
  }

}
