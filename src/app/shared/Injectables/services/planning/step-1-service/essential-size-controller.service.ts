import { Injectable } from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EssentialSizeDtoModel} from '../../../../models/planning/essential-size-211/essential-size-dto.model';
import {BaseResponseDtoModel} from '../../../../models/planning/essential-size-211/base-response-dto.model';
import {ResponseEntityModel} from '../../../../models/response-entity.model';
import {EssentialSizeOverallDtoModel} from '../../../../models/planning/essential-size-211/essential-size-overall-dto.model';
import {EssentialSizePerformanceDtoModel} from '../../../../models/planning/essential-size-211/essential-size-performance-dto.model';

@Injectable({
  providedIn: 'root'
})
export class EssentialSizeControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) { }

  /** method in order to get the data for the 2.1.1 form */
  fetchEssentialSizeByProjectId(projectId: number, formListId: number,locale: string)
    : Observable<EssentialSizeDtoModel>{
    return this.http.get<EssentialSizeDtoModel>(this.baseUrl + 'essential-sizes/order/' + projectId + '/' + formListId + '/' + locale);
  }

  /** method in order to post the whole 2.1.1 form */
  saveEssentialSize(orderId: number, formListId: number, resource: EssentialSizeDtoModel): Observable<ResponseEntityModel> {
    return this.http.post<ResponseEntityModel>(this.baseUrl + 'essential-sizes/' + orderId + '/' + formListId, resource);
  }

  /** base controller */
  fetchBaseList(projectId: number, locale: string): Observable<BaseResponseDtoModel[]>{
    return this.http.get<BaseResponseDtoModel[]>(this.baseUrl + 'essential-sizes/base/' + projectId + '/' + locale);
  }

  /** save overall */
  saveEssentialSizeOverall(orderId: number, formListId: number, resource: EssentialSizeOverallDtoModel)
    : Observable<EssentialSizeOverallDtoModel> {
    return this.http.post<EssentialSizeOverallDtoModel>(this.baseUrl + 'essential-sizes/overall/' + orderId + '/' + formListId, resource);
  }

  /** save performance */
  saveEssentialSizePerformance(orderId: number, formListId: number, resource: EssentialSizePerformanceDtoModel)
    : Observable<EssentialSizePerformanceDtoModel> {
    return this.http.post<EssentialSizePerformanceDtoModel>(this.baseUrl + 'essential-sizes/performance/'
      + orderId + '/' + formListId, resource);
  }

}
