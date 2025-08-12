import { ResolveFn, Router } from '@angular/router';
import { MemberFormsHelperService } from './member-forms-helper.service';
import { inject } from '@angular/core';
import { Membership } from 'src/app/models/member.model';
import moment from 'moment';
import { of, tap } from 'rxjs';

export const memberFormResolverResolver: ResolveFn<any> = (route, state) => {
  const _helper = inject(MemberFormsHelperService);
  if (route.params['type'] == 'add') {
    _helper.formType = _helper.formTypes.ADD_MEMBER;
    _helper.isFullMember = route.queryParams['full'] == 'false' ? false : true;
    if (route.queryParams['fresh']) {
      _helper.resetForms();
    }
    return of(true);
  } else {
    _helper.formType = _helper.formTypes.EDIT_MEMBER;
    _helper.isFullMember = false;
    return _helper.memberService.getMemberData(+route.queryParams['memberId']).pipe(tap(res => _helper.member = res.data.personalData));
  }

};


export const membershipFormResolverResolver: ResolveFn<any> = (route, state) => {
  const _helper = inject(MemberFormsHelperService);
  const _router = inject(Router);
  _helper.isMembershipOnly = false;

  if (route.params['type'] == 'add') {
    _helper.formType = _helper.formTypes.ADD_MEMBERSHIP;
    _helper.membership = {} as Membership;
    _helper.membership.paymentDate = moment().format('YYYY-MM-DDTHH:mm');

    if (route.queryParams['memberId']) {
      _helper.isMembershipOnly = true;
      return _helper.memberService.getMemberData(route.queryParams['memberId']).pipe(tap(res => {
        _helper.member = res.data.personalData;
        _helper.membership.contractNo = res.data.personalData.applicationNo;
        _helper.membership.accessCode = res.data.personalData.code;
        _helper.membership.phoneNo = res.data.personalData.phoneNo;
        _helper.membership.memberEnglishName = res.data.personalData.nameEng;
        _helper.membership.memberId = res.data.personalData.id;
      }));
    } else {
      _helper.isMembershipOnly = false;
      if (!Object.keys(_helper.member).length) {
        return _router.navigate(['/admin/form/member/add']);
      } else {
        return of(true);
      }
    }
  } else {
    _helper.isMembershipOnly = true;
    _helper.formType = _helper.formTypes.EDIT_MEMBERSHIP;
    return _helper.memberService.getMembershipById(route.queryParams['id']).pipe(tap((res) => _helper.membership = res.data))
  }

};
