import { Component, OnInit, TemplateRef, ViewChild, HostListener, inject } from '@angular/core';
import { MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IGymImage } from 'src/app/models/common.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { NgForm, FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { ImageTypes, ImageTypesName } from 'src/app/models/enums';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-gym-images',
    templateUrl: './gym-images.component.html',
    styleUrls: ['./gym-images.component.scss'],
    imports: [RoleDirective, MatButtonModule, MatIconModule, NgStyle, ClipboardModule, MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, TranslateModule]
})
export class GymImagesComponent implements OnInit {
  @ViewChild('addImgModal') addImgModal: TemplateRef<any>;
  @ViewChild('photoModal') photoModal: TemplateRef<any>;
  appConfig = inject(AppConfigService);
  images: IGymImage[] = [];
  proxyUrl = this.appConfig.envUrl;
  linkName: string;
  redirectUrl: string;
  imgPath: any;
  selectedImg: IGymImage;
  page: number = 0;
  totalElements: number;
  imageType: ImageTypes;
  imageTypeName: ImageTypesName;

  constructor(private adminService: AdministrationService, public dialog: MatDialog,
    private toastr: ToastrService, private translate: TranslateService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.imageType = this.route.snapshot.data['imageType'];
    this.imageTypeName = this.route.snapshot.data['imageTypeName'];

    this.getGymImages();
  }

  getGymImages(onPagination: boolean = false) {
    this.adminService.getGymImages(this.page, this.imageType).subscribe({
      next: (res) => {
        if (onPagination) {
          this.images = [...this.images, ...res.data];
        } else {
          this.images = res.data;
        }
        this.totalElements = res.totalCount;
        this.preventCall = false;
      }
    })
  }

  pictureZoom(image: IGymImage) {
    this.selectedImg = image;
    this.dialog.open(this.photoModal, {
      maxHeight: '95vh',
      maxWidth: '95vw'
    });
  }

  copyToClipboard() {
    this.toastr.success(this.translate.instant('management.msgToCopiedLink'));
  }
  openIn(path: string) {
    window.open(this.proxyUrl + path);
  }

  onAddLink() {
    this.dialog.open(this.addImgModal, {
      width: '400px'
    })
  }

  addLink(form: NgForm) {
    if (form.form.status === 'VALID') {
      let obj = {
        "imageName": this.linkName,
        "redirectURL": this.redirectUrl,
        "symbol": this.imageType
      }
      this.adminService.addLink(obj).subscribe({
        next: (res) => {
          this.getGymImages();
          this.dialog.closeAll();
        }
      });
    }
  }

  deleteImage(id: number) {
    this.adminService.deleteLink(id).subscribe();
  }


  onDeleteImage(image: IGymImage) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedImage'), subTitle: image.displayName },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteImage(image.id);
        this.images = this.images.filter(img => img.id != image.id);
        this.totalElements -= 1;
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



          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (_event) => {
            this.imgPath = reader.result;
          }


          const uploadData = new FormData();
          uploadData.append('Files', file);
          this.adminService
            .uploadImages(uploadData)
            .subscribe({
              next: (res: any) => {
                this.linkName = res.data[0];
              },
              error: (error) => {
                this.toastr.error('Error', error.statusText);
                e.target.value = null;
              },
            });
        } else {
          e.target.value = null;
          this.toastr.error('Image size is too big', 'Sorry! image size exceeds 1mb');
        }
      }
    }
  }

  preventCall: boolean;
  @HostListener('window:scroll', [])
  onWindowScroll(event: any) {
    let allPageHeight = document.body.scrollHeight;
    let visiblePageHeight = document.body.clientHeight;
    let maxScroll = allPageHeight - visiblePageHeight;
    let scrollAmount = window.pageYOffset;

    if (allPageHeight > visiblePageHeight && !this.preventCall) {
      if (maxScroll < (scrollAmount + 60) && this.totalElements > this.images.length) {
        this.preventCall = true;
        this.loadMore();
      }
    }
  }

  loadMore() {
    this.page = this.page + 1;
    this.getGymImages(true);
  }


}

