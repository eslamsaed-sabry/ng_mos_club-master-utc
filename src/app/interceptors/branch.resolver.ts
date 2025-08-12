import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { BrandService } from '../services/brand.service';
import { EMPTY, catchError, of, tap } from 'rxjs';
import { HttpResponseDTO } from '../models/common.model';



export const branchResolver: ResolveFn<HttpResponseDTO<any[]>> = (route, state) => {
  
  const brandService = inject(BrandService);
  const router = inject(Router);

  return brandService.getUserBranches().pipe(tap(res => {
  
    if (!brandService.currentBranch && res.data.length) {
      brandService.setBranch(res.data[0])
    }
    brandService.branches = res.data;
  }), catchError(() => {
    router.navigateByUrl('/auth/login');
    return EMPTY
  }))

};
