import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FlowchartControllerService} from '../../shared/Injectables/services/flowchart-controller.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../shared/Injectables/services/login.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {ProjectControllerService} from '../../shared/Injectables/services/project-controller.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() url: any;

  /** parameters in order to get the tax status */
  orderId: any;
  currentUser: any;

  /** lang parameter */
  currentLang: any;

  /** flowchart tables divided according the 4 states (statutory, tax, discussions and tools) */
  statutoryParent: any;
  flowChartStatutory: any;
  statutoryLoaded = false;

  statutoryParentPressed = false;

  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;
  status = true;
  selectedOrder: any;

  itemSelect: number[] = [];

  scrollToTop(): any {
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0
    });
  }

  constructor(private flowchartControllerService: FlowchartControllerService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private loginService: LoginService,
              private changeDetectorRef: ChangeDetectorRef,
              private orderControllerService: ProjectControllerService,
              media: MediaMatcher) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();

    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.orderId = Number(this.router.url.split('/')[3]);
    this.currentUser = localStorage.getItem('currentUser');
    this.statutoryParentPressed = (localStorage.getItem('statutoryParentPressed') === 'true');
    this.currentLang =  this.router.url.split('/')[1];
    this.selectedOrder = this.activatedRoute.snapshot.paramMap.get('id');
    if (!isNaN(this.orderId)) {
      this.getFlowChart();
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  getFlowChart(): void {
    if (this.orderId != null) {
      this.flowchartControllerService.getFlowChart(this.currentLang, this.orderId).subscribe(res => {
        // this.flowChart = res;
        res.forEach(row => {
          if (row.formName === 'statutory') {
            this.statutoryParent = row.name;
            this.flowChartStatutory = row.flowcharts;
            this.statutoryLoaded = true;
          }
        });
      });
    }
  }

  setItemsToLocalStorage(flowchartChildId: any): void {
    localStorage.setItem('flowchartChildId', flowchartChildId);
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  clicked(event: MouseEvent, formName: string, flowchartChildId: any): any {
    if (event.which === 2) {
      localStorage.setItem('flowchartChildId', flowchartChildId);
    }
  }

  statutoryPressed(): any {
    if (this.statutoryParentPressed === false) {
      localStorage.removeItem('statutoryParentPressed');
      this.statutoryParentPressed = true;
      localStorage.setItem('statutoryParentPressed', String(this.statutoryParentPressed));
    } else {
      localStorage.removeItem('statutoryParentPressed');
      this.statutoryParentPressed = false;
      localStorage.setItem('statutoryParentPressed', String(this.statutoryParentPressed));
    }
  }

}
