import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AttachmentContextTypeId, LookupType } from 'src/app/models/enums';
import { Attachment } from 'src/app/models/staff.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { MatOptionModule } from '@angular/material/core';
import { NgStyle } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-transformation-images',
    templateUrl: './transformation-images.component.html',
    styleUrls: ['./transformation-images.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, RoleDirective, MatButtonModule, MatIconModule, NgStyle, ClipboardModule, TranslateModule]
})
export class TransformationImagesComponent implements OnInit {
  // @ViewChild('addImgModal') addImgModal: TemplateRef<any>;
  @ViewChild('photoModal') photoModal: TemplateRef<any>;

  images: Attachment[] = [];
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  linkName: string;
  selectedImg: Attachment;
  coaches: any[] = [];
  coachId: number;
  constructor(private adminService: AdministrationService, public dialog: MatDialog,
    private toastr: ToastrService, private memberService: MemberService, private commonService: CommonService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getCoaches();
    this.getAttachments();
  }

  getCoaches() {
    this.memberService.getLookup(LookupType.Trainers).subscribe(
      (res: any) => {
        this.coaches = res
      });
  }

  getAttachments() {
    if (!this.coachId)
      return
    this.commonService.getAttachmentsForTrainer(this.coachId).subscribe({
      next: (res) => {
        this.images = res.data;
      }
    })
  }

  pictureZoom(image: Attachment) {
    this.selectedImg = image;
    this.dialog.open(this.photoModal, {
      maxHeight: '95vh',
      maxWidth: '95vw'
    });
  }

  copyToClipboard() {
    this.toastr.success(this.translate.instant('management.msgToCopiedLink'));
  }


  downloadImg(image: Attachment) {
    let url = this.proxyUrl + image.path;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = image.storedName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    }
    xhr.send();
  }

  openIn(path: string) {
    window.open(this.proxyUrl + path);
  }
  // onAddLink() {
  //   this.dialog.open(this.addImgModal)
  // }
  // addLink(form: NgForm) {
  //   if (form.form.status === 'VALID') {
  //     this.adminService.addLink(this.linkName).subscribe({
  //       next: (res) => {
  //         this.getGymImages();
  //         this.dialog.closeAll();
  //       }
  //     });
  //   }
  // }

  deleteImage(id: number) {
    this.commonService.deleteAttachment(id).subscribe();
  }


  onDeleteImage(image: Attachment) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedImage'), subTitle: image.storedName },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteImage(image.id);
        this.images = this.images.filter(img => img.id != image.id);
      }
    });
  }

  uploadImage(e: any) {
    let elem = e.target || e.srcElement;
    if (elem.files.length > 0) {
      let file = elem.files[0];
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      ) {
        // File types supported for image
        if (file.size < 1000000) {
          const uploadData = new FormData();
          uploadData.append('Files', file);
          this.commonService
            .addAttachmentForTrainer(this.coachId, uploadData)
            .subscribe({
              next: (res: any) => {
                this.getAttachments();
              },
              error: (error) => {
                this.toastr.error('Error', error.statusText);
                e.target.value = null;
              },
            });
        } else {
          e.target.value = null;
          this.toastr.error(
            'Image size is too big',
            'Sorry! image size exceeds 1mb'
          );
        }
      }
    }
  }

  onUpload(uploadInp: any, form: NgForm) {
    if (form.form.status === 'VALID') {
      uploadInp.click();
    } else {
      this.toastr.error(this.translate.instant('members.msgToSelectCoach'))
    }
  }

}

