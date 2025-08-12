import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { IBranch, ICountryCode, IRole } from 'src/app/models/common.model';
import { LookupType } from 'src/app/models/enums';
import { IClassRoom } from 'src/app/models/schedule.model';
import { dialogStaffData, Shift, IStaff, IStaffJob } from 'src/app/models/staff.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { CommonService } from 'src/app/services/common.service';
import { StaffService } from 'src/app/services/staff.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { forkJoin } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CameraComponent } from '../../../../shared/camera/camera.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-staff-form',
  templateUrl: './staff-form.component.html',
  imports: [MatDialogTitle, FormsModule, MatDialogContent, MatButtonModule, MatIconModule, CameraComponent, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, NgClass, MatDialogActions, TranslateModule, AsyncPipe]
})
export class StaffFormComponent implements OnInit {
  staffMember: IStaff = {} as IStaff;
  roles: IRole[] = [];
  shifts: Shift[] = [];
  managers: any[] = [];
  jobTitles: IStaffJob[] = [];
  hasLoginAccess: boolean;
  classTypes: IClassRoom[];
  webcamImage: WebcamImage | undefined;
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  cameraConfig = {
    width: 263,
    height: 263
  }
  countryCodes: ICountryCode[] = [];
  branches: any[] = [];
  branchesIds: number[] = [];
  barcode: string;
  teams: any[] = [];

  public dialogRef = inject(MatDialogRef<StaffFormComponent>);
  private staffService = inject(StaffService);
  private adminService = inject(AdministrationService);
  private toastr = inject(ToastrService);
  public commonService = inject(CommonService);
  public data = inject<dialogStaffData>(MAT_DIALOG_DATA);
  destroyRef = inject(DestroyRef);
  classProgram$ = this.commonService.getLookup(LookupType.ClassPrograms);

  ngOnInit(): void {

    this.getCountryCodes();
    if (this.data.type === 'edit') {
      this.staffMember = this.data.staff;
      this.hasLoginAccess = !!this.data.staff.userId;
      this.getAssignedClasses();
      this.getAssignedPrograms();
      this.getAssignedBranches();
      this.getPackageBranches();
      if (this.staffMember.code)
        this.barcode = `https://barcode.tec-it.com/barcode.ashx?data=${this.staffMember.code}&code=Code128&translate-esc=true&hidehrt=True&width=100&height=20`
    }

    this.getTeams();
    this.getBranches();


    if (this.data.type === 'add') {
      this.staffMember.phoneFormatId = 1;
      this.staffMember.isInstructor = this.data.isInstructor;
    }

    if (this.data.isInstructor) {
      this.getClasses();
    } else {
      this.getClasses();
      this.getShifts();
      this.getManagers();
      this.getJobTitles();
    }
    this.getRoles();
  }

  getCountryCodes() {
    this.commonService.getCountryCodes().subscribe({
      next: (res) => {
        this.countryCodes = res.data;
      }
    })
  }

  getAssignedClasses() {
    this.staffService.getAssignedClasses(this.staffMember.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.staffMember.classes = res.data;
      }
    })
  }
  getAssignedPrograms() {
    this.staffService.getAssignedPrograms(this.staffMember.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.staffMember.programs = res.data;
      }
    })
  }

  getAssignedBranches() {
    this.staffService.getAssignedBranches(this.staffMember.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.staffMember.branches = res.data;
      }
    })
  }

  getTeams() {
    this.commonService.getLookup(LookupType.Teams).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.teams = res;
      }
    })
  }

  getClasses() {
    this.commonService.getLookup(LookupType.ClassesTypes).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.classTypes = res;
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getRoles() {
    this.adminService.getRoles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.roles = res.data;
      }
    })
  }

  getShifts() {
    this.staffService.getShifts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.shifts = res.data;
      }
    })
  }
  getManagers() {
    this.commonService.getLookup(LookupType.Staff).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.managers = res;
      }
    })
  }
  getJobTitles() {
    this.staffService.getJobTitles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.jobTitles = res.data;
      }
    })
  }

  validateNationalID() {
    if (this.staffMember.nationalId.length !== 14) {
      this.toastr.error('Invalid national ID, should be 14 characters');
    } else {
      let arr = this.staffMember.nationalId.split("");
      this.staffMember.birthDate = new Date(arr[3] + arr[4] + '-' + arr[5] + arr[6] + '-' + arr[1] + arr[2]);
    }
  }

  submit(f: NgForm) {
    if (this.hasLoginAccess && !this.staffMember.userId) this.setLoginAccess();
    if (this.commonService.validatePhoneNumber(this.staffMember.phoneNo, this.staffMember.phoneFormatId, this.countryCodes)) {
      if (f.form.status === 'VALID') {
        if (this.staffMember.branches)
          this.staffMember.branches = this.staffMember.branches.filter(b => b != 0);

        if (this.data.type === 'add') {
          if (this.data.isTrainer) {
            this.staffMember.isTrainer = true;
            const jobTitle = this.jobTitles.filter(x => x.nameENG == "Coach");
            this.staffMember.jobTitleId = jobTitle[0].id;
            this.staffService.addTrainer(this.staffMember).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
              next: (res) => {
                this.dismiss('success');
              }
            })
          }
          else if (!this.data.isInstructor) {
            this.staffService.addStaff(this.staffMember).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
              next: (res) => {
                this.dismiss('success');
              }
            })
          }
          else {
            this.staffService.addInstructor(this.staffMember).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
              next: (res) => {
                this.dismiss('success');
              }
            })
          }

        } else {
          this.staffService.editStaff(this.staffMember).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (res) => {
              this.dismiss('success');
            }
          })
        }
      }
    }
  }

  setLoginAccess() {
    this.staffMember.userCommand = {
      nameEng: this.staffMember.englishName,
      nameAR: this.staffMember.arabicName,
      userName: this.staffMember.userName,
      password: this.staffMember.password,
      roleId: this.staffMember.roleId,
      branchesIds: this.branchesIds.filter(b => b != 0)
    }
  }

  upload(e: any) {
    let elem = e.target || e.srcElement;
    // let props = {
    //   contextId: this.staffMember.id,
    //   contextTypeId: AttachmentContextTypeId.STAFF
    // }
    if (elem.files.length > 0) {
      let file = elem.files[0];
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      ) {
        if (file.size < 1000000) {
          const uploadData = new FormData();
          uploadData.append('Files', file);
          this.commonService
            .uploadImages(uploadData)
            .subscribe({
              next: (res: any) => {
                // this.staffMember.imagePath = environment.server + '/images/' + res.data[0];
                this.webcamImage = undefined;
                this.staffMember.photo = res.data[0];
                this.staffMember.isImageChanged = false;
                this.staffMember.imageBase64 = null;
                this.toastr.success('Image uploaded successfully');
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
    this.staffMember.isImageChanged = true;
    this.staffMember.imageBase64 = webcamImage.imageAsDataUrl;
  }

  getBranches() {
    this.commonService.getCurrentUserBranches().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.branches = res.data;
        if (this.branches.length == 1)
          this.staffMember.mainBranchId = this.branches[0].id;
      }
    })
  }

  onSelect(type: string) {
    if (type == "login") {
      if (this.branchesIds.includes(0)) {
        this.branchesIds = [0, ...this.branches.map(el => el.id)];
      } else {
        this.branchesIds = [];
      }
    }
    else if (type == "instructor") {
      if (this.staffMember.branches.includes(0)) {
        this.staffMember.branches = [0, ...this.branches.map(el => el.id)];
      } else {
        this.staffMember.branches = [];
      }
    }

  }

  getPackageBranches() {
    let currentBranches: number[] = [];

    forkJoin([
      this.adminService.getUserBranchesId(this.staffMember.userId),
      this.commonService.getCurrentUserBranches()
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ([packageBranches, allBranches]) => {
        let branches: any = allBranches.data;
        branches.forEach((c: IBranch) => {
          packageBranches.data.forEach((n: number) => {
            if (c.id === n) {
              currentBranches.push(c.id);
            }
          })
        });

        this.branches = branches;
        this.branchesIds = currentBranches;
      }
    })
  }

  validateBarcode() {
    if (this.staffMember.code.length > 0)
      this.barcode = `https://barcode.tec-it.com/barcode.ashx?data=${this.staffMember.code}&code=Code128&translate-esc=true&hidehrt=True&width=100&height=20`
    else
      this.barcode = '';
  }

  copyName() {
    if (this.data.type === 'add')
      this.staffMember.arabicName = this.staffMember.englishName;
  }
}
