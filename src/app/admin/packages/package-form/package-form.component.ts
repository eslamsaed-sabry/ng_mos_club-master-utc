import { Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Benefit, dialogPackageData, IPackage, PackageTypesArray } from 'src/app/models/member.model';
import { NgForm, FormsModule } from '@angular/forms';
import { PackagesService } from 'src/app/services/packages.service';
import { MemberService } from 'src/app/services/member.service';
import { LookupType, PackageTypes } from 'src/app/models/enums';
import { IClassRoom } from 'src/app/models/schedule.model';
import { forkJoin, map, mergeMap, of, switchMap } from 'rxjs';
import { WeekPlannerComponent } from 'src/app/shared/week-planner/week-planner.component';
import { ToastrService } from 'ngx-toastr';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { CommonService } from 'src/app/services/common.service';
import { IBranch } from 'src/app/models/common.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WeekPlannerComponent as WeekPlannerComponent_1 } from '../../../shared/week-planner/week-planner.component';
import { CounterInputComponent } from '../../../shared/counter-input/counter-input.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.scss'],
  imports: [MatDialogTitle, FormsModule, MatDialogContent, MatRadioModule, MatFormFieldModule, MatSelectModule, MatOptionModule, CounterInputComponent, WeekPlannerComponent_1, MatCheckboxModule, AsyncPipe, MatInputModule, NgxMaterialTimepickerModule, MatDialogActions, MatButtonModule, TranslateModule],
  providers: [PackagesService]
})
export class PackageFormComponent implements OnInit {
  @ViewChild('planner') planner: WeekPlannerComponent;
  public dialogRef = inject(MatDialogRef<PackageFormComponent>);

  public data = inject<dialogPackageData>(MAT_DIALOG_DATA);

  private packageService = inject(PackagesService);
  private memberService = inject(MemberService);

  private toastr = inject(ToastrService);
  private standardDate = inject(StandardDatePipe);
  private common = inject(CommonService);

  package: IPackage = {} as IPackage;
  packageTypes: any[] = [];
  incomeTypes: any[] = [];
  OtherType = PackageTypes.OTHER;
  Gym = PackageTypes.GYM;
  specificAttendance: boolean;
  branches: any[] = [];
  accessAreas: any[] = [];
  packageCats = PackageTypesArray;
  classProgram$ = this.common.getLookup(LookupType.ClassPrograms).pipe(
    switchMap(progs => {
      if (this.data.type === 'edit') {
        if (this.data.package.packageCategory === this.OtherType || this.data.package.packageCategory === this.Gym) {
          this.package.programs = [];
          return this.packageService.getPackagePrograms(this.data.package.id).pipe(
            map(packageProgs => {
              const selectedIds = packageProgs.data;
              progs.forEach((c: IClassRoom) => {
                if (selectedIds.includes(c.id)) {
                  c.checked = true;
                  this.package.programs.push(c.id);
                }
              });
              return progs;
            })
          );
        } else {
          return of(progs);
        }
      }
      else {
        return of(progs);
      }
    })
  );



  ngOnInit(): void {
    this.getPackagesTypes();
    this.getIncomeType();
    if (this.data.type === 'edit') {
      this.getPackageBranches();
      this.getPackageAccessAreas();
      this.package = this.data.package;

      if (this.package.availabilityFrom)
        this.package.availabilityFrom = this.standardDate.transform(this.data.package.availabilityFrom, DateType.DATE_TIME_INPUT);

      if (this.package.availabilityTo)
        this.package.availabilityTo = this.standardDate.transform(this.data.package.availabilityTo, DateType.DATE_TIME_INPUT);

      if (this.data.package.packageCategory != this.OtherType || this.data.package.packageCategory != this.Gym)
        this.getPackageBenefits();
    }
    if (this.data.type === 'add') {
      this.getAllBenefits();
      this.getBranches();
      this.getAccessAreas();
    }
  }

  getPackageBenefits() {
    forkJoin([
      this.packageService.getPackageBenefits(this.data.package.id),
      this.memberService.getAllBenefits()
    ]).subscribe({
      next: ([packageBenefits, allBenefits]) => {
        let benefits: Benefit[] = [...packageBenefits.data, ...allBenefits.data];
        const uniqueIds = benefits.filter((obj, index) => {
          return index === benefits.findIndex(o => obj.id === o.id && obj.name === o.name);
        });
        this.package.benfitList = uniqueIds;
      }
    })
  }

  getPackagesTypes() {
    this.memberService.getLookup(LookupType.PackageType).subscribe({
      next: (res: any) => {
        this.packageTypes = res;
      }
    })
  }

  getIncomeType() {
    this.memberService.getLookup(LookupType.IncomeType).subscribe({
      next: (res: any) => {
        this.incomeTypes = res;
      }
    })
  }


  getAllBenefits() {
    this.memberService.getAllBenefits().subscribe({
      next: (res) => {
        this.package.benfitList = res.data;
      },
    });
  }
  dismiss(action: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: action, data: data });
  }

  submit(f: NgForm) {
    if (this.package.isDays === undefined) {
      this.toastr.error('Duration Type is required')
    }
    if (!this.package.packageCategory) {
      this.toastr.error('Package Category is required')
    }

    // if (this.package.packageCategory != this.OtherType)
    this.package = { ...this.package, ...this.planner.submit() };

    if (f.form.status === 'VALID') {
      this.package.branchesIds = this.package.branchesIds.filter(b => b != 0);

      this.package.areasIds = this.package.areasIds ? this.package?.areasIds.filter(b => b != 0) : [];

      if (this.data.type === 'add') {
        this.package.isActive = true;
        this.packageService.addPackage(this.package).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        });
      } else {
        this.packageService.editPackage(this.package).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        });
      }
    }
  }

  onChooseClass(e: any, id: number) {
    if (!this.package.programs) this.package.programs = [];
    if (e.checked) {
      this.package.programs.push(id);
    } else {
      this.package.programs = this.package.programs.filter(el => el != id);
    }
  }

  onSelect() {

    if (this.package.branchesIds.includes(0)) {
      this.package.branchesIds = [0, ...this.branches.map(el => el.id)];
    } else {
      this.package.branchesIds = [];
    }

  }

  onAccessAreasSelect() {
    if (this.package.areasIds.includes(0)) {
      this.package.areasIds = [0, ...this.accessAreas.map(el => el.id)];
    } else {
      this.package.areasIds = [];
    }

  }

  getBranches() {
    this.common.getCurrentUserBranches().subscribe({
      next: (res: any) => {
        this.branches = res.data;
      }
    })
  }

  getAccessAreas() {
    this.common.getLookup(LookupType.AccessAreas).subscribe({
      next: (res: any) => {
        this.accessAreas = res;
      }
    })
  }

  getPackageAccessAreas() {
    let currentAccessAreas: number[] = [];

    forkJoin([
      this.packageService.getPackageAccessAreas(this.data.package.id),
      this.memberService.getLookup(LookupType.AccessAreas)
    ]).subscribe({
      next: ([packageAccessAreas, allAccessAreas]) => {
        let accessAreas: any = allAccessAreas;
        accessAreas.forEach((c: IBranch) => {
          packageAccessAreas.data.forEach((n: number) => {
            if (c.id === n) {
              currentAccessAreas.push(c.id);
            }
          })
        });

        this.accessAreas = accessAreas;
        this.package.areasIds = currentAccessAreas;
      }
    })

  }

  getPackageBranches() {
    let currentBranches: number[] = [];

    forkJoin([
      this.packageService.getPackageBranches(this.data.package.id),
      this.common.getCurrentUserBranches()
    ]).subscribe({
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
        this.package.branchesIds = currentBranches;
      }
    })

  }

  copyName() {
    if (this.data.type === 'add')
      this.package.nameAR = this.package.nameEng;
  }

}
