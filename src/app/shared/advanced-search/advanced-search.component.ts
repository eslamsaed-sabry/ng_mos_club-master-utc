import { Component, EventEmitter, Input, OnInit, Output, HostListener, inject, HostBinding } from '@angular/core';
import { Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { debounceTime, fromEvent, Subject } from 'rxjs';
import { SearchConfig } from 'src/app/models/common.model';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Redirection, Theme } from 'src/app/models/enums';
import { AppConfigService } from 'src/app/services/app-config.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';
@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  imports: [NgClass, FormsModule, MatProgressSpinnerModule, MatIconModule, NgStyle, MatButtonModule, SpinnerComponent, TranslateModule]
})
export class AdvancedSearchComponent implements OnInit {
  @HostBinding('class') hostClass = '';
  private memberService = inject(MemberService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  @Input() config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Profile,
    theme: Theme.Header
  };
  @Output() selectedMember: EventEmitter<any> = new EventEmitter();
  loading: boolean;
  onSearchResults: boolean;
  results: Member[] = [];
  searchType: string = 'name';
  public appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  @Input() searchKeyword: string;
  onScrollLoading: boolean;
  page: number = 0;
  pageSize: number = 10;
  @Input() autoPredict: boolean;
  memberSelected: Member = {} as Member;


  ngOnInit(): void {
    fromEvent(document, 'click')
      .subscribe(() => {
        if (this.config.theme != Theme.Fixed)
          this.onSearchResults = false;
      });
    this.searchSubject.pipe(debounceTime(1000)).subscribe((res) => {
      this.getMembers();
    });
  }

  getMembers() {
    let props: any = {
      showSuccessToastr: 'false',
      showSpinner: 'false',
      searchText: this.searchKeyword,
      skipCount: this.page * this.pageSize,
      takeCount: this.pageSize
    };

    this.memberService.searchMembers(props).subscribe({
      next: (res: any) => {
        this.results = [...this.results, ...res.data];
        this.onSearchResults = true;
        this.onScrollLoading = false;
        this.loading = false;
        this.preventCall = false;
        if (res.totalCount < this.pageSize) {
          this.preventCall = true;
        }
        if (res.totalCount <= this.results.length) {
          this.preventCall = true;
        }
      },
    });
  }

  preventCall: boolean;
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let listHeight = event.target.firstChild.clientHeight;
    let containerHeight = event.target.clientHeight;
    let maxScroll = listHeight - containerHeight;
    let scrollAmount = event.target.scrollTop;

    if (listHeight > containerHeight && !this.preventCall) {
      if (maxScroll < (scrollAmount + 60)) {
        this.preventCall = true;
        this.onScrollLoading = true;
        this.page = this.page + 1;
        this.getMembers();
      }
    }
  }

  searchSubject = new Subject<any>();
  search() {
    if (this.searchKeyword.trim().length > 0) {
      if (this.autoPredict && this.searchKeyword.trim().length > 0) {
        this.results = [];
        this.loading = true;
        this.onSearchResults = false;
        this.page = 0;
        this.searchSubject.next(null);
      }
    }
  }

  searchByName() {
    this.results = [];
    this.loading = true;
    this.onSearchResults = false;
    this.page = 0;
    this.searchSubject.next(null);
  }

  searchWordCheck() {
    let wordArr: any[] = this.searchKeyword.split("");
    if (wordArr.length > 5) {
      if (isNaN(wordArr[5])) {
        // search by name
        this.searchByName();
      } else {
        // search by id 
        let m = {} as Member;
        m.id = this.searchKeyword
        this.selectedMember.emit(m);
      }
    } else {
      if (isNaN(+this.searchKeyword)) {
        this.searchByName()
      } else {
        let m = {} as Member;
        m.id = this.searchKeyword
        this.selectedMember.emit(m);
      }
    }
  }

  onSelectMember(r: Member) {
    this.memberSelected = r;
    this.searchKeyword = r.nameEng;
    if (this.config.redirectionType === Redirection.Profile) {
      this.router.navigate(['/admin/member-profile/' + r.id])
    } else {
      this.selectedMember.emit(r);
    }
  }

  attend(member: Member) {
    this.router.navigate(['/admin/attendance-monitoring'], {
      queryParams: {
        id: member.id,
        attend: true
      }
    }).then(() => {
      this.onSearchResults = false;
    })
  }



}
