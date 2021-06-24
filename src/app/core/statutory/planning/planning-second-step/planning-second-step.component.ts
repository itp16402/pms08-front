import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormViewStatusDtoModel} from "../../../../shared/models/general-form-view-models/form-view-status-dto.model";
import {ActivatedRoute, Router} from "@angular/router";
import {FormService} from "../../../../shared/Injectables/services/form.service";

@Component({
  selector: 'app-planning-second-step',
  templateUrl: './planning-second-step.component.html',
  styleUrls: ['./planning-second-step.component.scss']
})
export class PlanningSecondStepComponent implements OnInit, AfterViewInit {

  tableName: any;
  splitTitles: any[] = [];
  responseTitlesList: FormViewStatusDtoModel[] = [];
  currentLang: any;
  currentUser: any;
  loadTitles = false;
  flowChartId: any;
  memberId: any;
  orderId: any;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private formService: FormService,
              private cdf: ChangeDetectorRef) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('currentUser');
    this.currentLang =  this.router.url.split('/')[1];
    this.flowChartId = localStorage.getItem('flowchartChildId');
    this.orderId = Number(this.router.url.split('/')[3]);
    this.memberId = localStorage.getItem('memberId');
  }


  ngAfterViewInit(): void {
    this.cdf.detectChanges();
    this.getTitle(this.currentLang, this.splitTitles, this.flowChartId, this.orderId);
  }

  setTableNameToLocalStorage(tableName: any): any {
    if (tableName.tableName === 'a231') {
      this.router.navigate([this.currentLang, 'home', this.orderId, 'statutory', 'planning', 'planning-second-step', '1', tableName.tableName]);
    }
  }

  getTitle(lang: any, splitterTable: any, flowChartId: any, orderId: any): any {
    // tslint:disable-next-line:radix
    flowChartId = parseInt(flowChartId);
    // tslint:disable-next-line:radix
    orderId = parseInt(orderId);
    this.formService.findFormsByNamesAndStatusByFlowchartChild(flowChartId, lang, 'TITLE', orderId).subscribe(res => {
      this.responseTitlesList = res;
      this.loadTitles = true;
    });
  }

  clicked(event: MouseEvent, tableName: any): any {
    if (event.which === 2) {
      if (tableName.tableName === 'a231') {
        this.router.navigate([this.currentLang, 'home', this.orderId, 'statutory', 'planning',
          'planning-second-step', '1', tableName.tableName]);
      }
    }
  }
}

