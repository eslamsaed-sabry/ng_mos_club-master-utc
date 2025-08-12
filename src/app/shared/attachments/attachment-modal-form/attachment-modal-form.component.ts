import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { dialogAttachmentData } from 'src/app/models/staff.model';
import { CommonService } from 'src/app/services/common.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { CameraComponent } from '../../camera/camera.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-attachment-modal-form',
    templateUrl: './attachment-modal-form.component.html',
    styleUrls: ['./attachment-modal-form.component.scss'],
    imports: [MatButtonModule, MatIconModule, CameraComponent, TranslateModule]
})
export class AttachmentModalFormComponent {
  webcamImage: WebcamImage | undefined;
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  cameraConfig = {
    width: 263,
    height: 263
  }
  photo: string;
  constructor(public dialogRef: MatDialogRef<AttachmentModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogAttachmentData,
    private toastr: ToastrService, private sanitize: DomSanitizer,
    private commonService: CommonService) { }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  upload(e: any) {
    let props = {
      contextId: this.data.contextId,
      contextTypeId: this.data.contextTypeId
    }
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
            .addAttachment(props, uploadData)
            .subscribe({
              next: (res: any) => {
                let url = URL.createObjectURL(file);
                this.photo = <any>this.sanitize.bypassSecurityTrustResourceUrl(url);
                this.webcamImage = undefined;
                this.photo = res.data[0];
                this.toastr.success('Image uploaded successfully');
                this.dismiss('success')
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


  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this.photo = webcamImage.imageAsDataUrl;
    let props = {
      contextId: this.data.contextId,
      contextTypeId: this.data.contextTypeId,
      imageBase64: <any>this.photo
    }

    this.commonService.addAttachmentBase64(props)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Image uploaded successfully');
          this.dismiss('success')
        },
        error: (error) => {
          this.toastr.error('Error', error.statusText);
        },
      });
  }

}
