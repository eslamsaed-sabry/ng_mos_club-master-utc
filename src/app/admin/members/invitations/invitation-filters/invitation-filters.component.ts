import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InvitationFilter } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DebtStatus, Gender } from 'src/app/models/enums';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-invitation-filters',
    templateUrl: './invitation-filters.component.html',
    styleUrls: ['./invitation-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatButtonModule, TranslateModule]
})
export class InvitationFiltersComponent implements OnInit {
  @Input() filters: InvitationFilter;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  gender = Gender;
  debtStatus = DebtStatus;

  constructor(private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
  }


}
