import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckedInMembersFilters } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Gender } from 'src/app/models/enums';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-checked-in-members-filters',
    templateUrl: './checked-in-members-filters.component.html',
    styleUrls: ['./checked-in-members-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, TranslateModule]
})
export class CheckedInMembersFiltersComponent implements OnInit {
  @Input() filters: CheckedInMembersFilters;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  gender = Gender;

  constructor(private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
  }


}
