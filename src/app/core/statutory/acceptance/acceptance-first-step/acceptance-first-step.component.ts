import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormService} from '../../../../shared/Injectables/services/form.service';
import {FormViewStatusDtoModel} from '../../../../shared/models/general-form-view-models/form-view-status-dto.model';

@Component({
  selector: 'app-acceptance-first-step',
  templateUrl: './acceptance-first-step.component.html',
  styleUrls: ['./acceptance-first-step.component.scss']
})
export class AcceptanceFirstStepComponent implements OnInit, AfterViewInit {

  tableName: any;
  stepTitle: FormViewStatusDtoModel[] = [];
  currentLang: any;
  selectedTable: any;
  flowChartId: any;
  memberId: any;
  orderId: any;
  loadTitles = false;

  constructor(private router: Router,
              private formService: FormService,
              private cdf: ChangeDetectorRef) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.currentLang =  this.router.url.split('/')[1];
    this.tableName = localStorage.getItem('pulls');
    this.flowChartId = localStorage.getItem('flowchartChildId');
    this.orderId = Number(this.router.url.split('/')[3]);
    this.memberId = localStorage.getItem('memberId');
  }

  ngAfterViewInit(): void {
    this.cdf.detectChanges();
    this.getTitle(this.currentLang, this.tableName, this.flowChartId, this.orderId);
  }

  getTitle(lang: any, tableName: any, flowChartId: any, orderId: any): void {
    // tslint:disable-next-line:radix
    flowChartId = parseInt(flowChartId);
    // tslint:disable-next-line:radix
    orderId = parseInt(orderId);
    this.formService.findFormsByNamesAndStatusByFlowchartChild(flowChartId, lang, 'TITLE', orderId).subscribe(res => {
      this.stepTitle = res;
      this.loadTitles = true;
    });
  }

  setTableNameToLocalStorage(tableName: any): void {
    if (tableName.tableName === 'a111') {
      this.router.navigate([this.currentLang, 'home', this.orderId, 'statutory', 'acceptance',
        'acceptance-first-step', '1', tableName.tableName]);
    }
  }

  clicked(event: MouseEvent, tableName: any): any {
    if (event.which === 2) {
      if (tableName.tableName === 'a111') {
        this.router.navigate([this.currentLang, 'home', this.orderId, 'statutory', 'acceptance',
          'acceptance-first-step', '1', tableName.tableName]);
      }
    }
  }
}
