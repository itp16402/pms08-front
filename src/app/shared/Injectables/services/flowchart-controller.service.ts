import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {FlowChartParentModel} from '../../models/flow-chart-parent.model';

@Injectable({
  providedIn: 'root'
})
export class FlowchartControllerService {

  baseUrl = environment.menuPath;

  constructor(private http: HttpClient) { }

  getFlowChart(locale: string, projectId: any): Observable<FlowChartParentModel[]> {
    return this.http.get<FlowChartParentModel[]>(this.baseUrl + 'flowcharts/' + locale + '/' + projectId);
  }

}
