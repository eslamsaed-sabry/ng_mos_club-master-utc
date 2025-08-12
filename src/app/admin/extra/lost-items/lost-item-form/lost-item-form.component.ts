import { Component, OnInit, Inject } from '@angular/core';
import { dialogLostItemData, IDialogFoundByData, ILostItem } from 'src/app/models/extra.model';
import { CommonService } from 'src/app/services/common.service';
import { ExtraService } from 'src/app/services/extra.service';
import { forkJoin } from 'rxjs';
import { LookupType } from 'src/app/models/enums';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { NgForm, FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FoundByFormComponent } from '../found-by-form/found-by-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-lost-item-form',
    templateUrl: './lost-item-form.component.html',
    styleUrls: ['./lost-item-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogActions, TranslateModule],
    providers: [ExtraService]
})
export class LostItemFormComponent implements OnInit {
  item: ILostItem = {} as ILostItem;
  categories: any[] = [];
  locations: any[] = [];
  imageError: string | null;
  isImageSaved: boolean;
  cardImageBase64: string | null;
  previewImagePath: string;

  finderName: string | undefined;
  constructor(public dialogRef: MatDialogRef<LostItemFormComponent>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: dialogLostItemData, private extraService: ExtraService,
    private common: CommonService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getLookUps();
    if (this.data.type === 'edit') {
      this.item = this.data.item!;
      this.finderName = this.data.item?.finderName;
      this.item.imageBase64 = environment.server + this.data.item?.imageName;
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  getLookUps() {
    forkJoin([
      this.common.getLookup(LookupType.LostCategory),
      this.common.getLookup(LookupType.LocationsInsideGym),
    ])
      .subscribe({
        next: ([categories, locations]) => {
          this.categories = categories;
          this.locations = locations;
        }
      })
  }



  submit(form: NgForm) {
    if (!this.finderName) {
      this.toastr.error(this.translate.instant('extra.specifyLostItemFounder'));
      return
    }
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.extraService.addLostItem(this.item).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      } else {
        this.extraService.editLostItem(this.item).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      }
    }
  }

  onFileChange(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = (rs: any) => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width']!;
          if (img_height > max_height && img_width > max_width) {
            this.imageError = 'Maximum dimensions allowed ' + max_height + '*' + max_width + 'px';
            return;
          } else {
            this.item.isImageChanged = true;
            this.item.imageBase64 = e.target.result;
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImg() {
    this.item.imageBase64 = null;
  }



  foundBy() {
    let data: IDialogFoundByData = {
      dialogType: "FOUND_BY"
    }
    if (this.data.type === 'edit') {
      data.item = this.item
    }
    let dialogRef = this.dialog.open(FoundByFormComponent, {
      maxHeight: '80vh',
      data: data,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.item.finderEmployeeId = result.data.employeeId;
        this.item.finderMemberId = result.data.memberId;
        this.finderName = result.data.finderName
      }
    });
  }







}
