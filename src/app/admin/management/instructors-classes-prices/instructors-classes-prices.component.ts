
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { InstructorClassesPrice, dialogInstructorClassesPriceData } from 'src/app/models/management.model';
import { CommonService } from 'src/app/services/common.service';
import { ManagementService } from 'src/app/services/management.service';

@Component({
    selector: 'app-instructors-classes-prices',
    templateUrl: './instructors-classes-prices.component.html',
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatButtonModule, TranslateModule, MatRadioModule]
})
export class InstructorsClassesPricesComponent {
  instructorClasses: InstructorClassesPrice[];
  instructorClassesPriceData: dialogInstructorClassesPriceData = {} as dialogInstructorClassesPriceData;
  instructors: any[] = [];
  instructorId: number;

  private common = inject(CommonService);
  private managementService = inject(ManagementService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getStaffMembers();
  }

  getStaffMembers() {
    this.common.getLookup(LookupType.Instructors).subscribe({
      next: (res: any) => {
        this.instructors = res;
        if (this.instructors.length) {
          this.instructorId = this.instructors[0].id;
          this.getInstructorClassesPrice();
        }
      }
    })
  }

  getInstructorClassesPrice() {
    this.managementService.getAssignedClassesFullDetails(this.instructorId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.instructorClasses = res.data;
      }
    })
  }

  submit() {
    this.instructorClassesPriceData.instructorId = this.instructorId;
    this.instructorClassesPriceData.classTypePrice = this.instructorClasses;
    this.managementService.setPriceForInstructorsClasses(this.instructorClassesPriceData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }
}
