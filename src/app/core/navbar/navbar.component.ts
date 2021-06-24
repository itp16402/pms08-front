import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {FormService} from '../../shared/Injectables/services/form.service';
import {FormViewModel} from '../../shared/models/general-form-view-models/form-view.model';
import {ProjectControllerService} from '../../shared/Injectables/services/project-controller.service';
import {ProjectResponseDtoModel} from '../../shared/models/project-response-dto.model';
import {LoginService} from '../../shared/Injectables/services/login.service';
import {UserControllerService} from '../../shared/Injectables/services/user-controller.service';
import {UserDtoModel} from '../../shared/models/acceptance/member/user-dto.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  @Input() url: any;

  isExpanded = true;
  isShowing = false;

  dir = 'ltr';
  green = false;
  blue = false;
  dark = false;
  minisidebar = false;
  boxed = false;
  danger = false;

  status = true;
  currentLang: any;
  currentUser: any;
  orderId: any;
  orderInfo: ProjectResponseDtoModel = Object.create(null);

  sidebarOpened = false;
  public config: PerfectScrollbarConfigInterface = {};

  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  /** lists for the 3 needed buttons and their children */
  navbarFields: FormViewModel[] = [];
  /** Action group with header and children */
  actionHeader: any;

  /** logout parameters */
  logout: any;
  logoutIcon: any;

  userDtoModel: UserDtoModel = Object.create(null);
  userInfoLoaded = false;


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef,
              private formService: FormService,
              private orderControllerService: ProjectControllerService,
              public loginService: LoginService,
              private userControllerService: UserControllerService,
              media: MediaMatcher) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.currentLang =  this.router.url.split('/')[1];
    this.currentUser = localStorage.getItem('currentUser');
    this.orderId = Number(this.router.url.split('/')[3]);
    this.getLogoutField();
    this.getLoggedInUser(this.currentUser);
    if (this.url === 'home' ){
      this.getNavbarFields();
      this.findOrderInfo(this.orderId, this.currentUser);
    }
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  changeLanguage(): void {
    const lang = this.router.url.split('/')[1];
    if (lang === 'el') {
      const test = this.router.url.replace('el', 'en');
      this.router.navigateByUrl(test);
      this.ngOnInit();
    } else if (lang === 'en') {
      const test = this.router.url.replace('en', 'el');
      this.router.navigateByUrl(test);
      this.ngOnInit();
    } else {
      const test = this.router.url.replace(lang, 'el');
      this.router.navigateByUrl(test);
      this.ngOnInit();
    }
  }

  clickEvent(event: any): void {
    this.status = !this.status;
  }

  check(url: string): boolean {
    return url === 'home';
  }

  getNavbarFields(): void {
    this.formService.getFormViewModel('NAVBAR', this.currentLang, 'T').subscribe(res => {
      this.navbarFields = res;
      this.declareGroups(this.navbarFields);
    });
  }

  getLogoutField(): void {
    this.formService.getFormViewModel('LOGOUT', this.currentLang, 'T').subscribe(res => {
      res.forEach(row => {
        if (row.typos === 'LOGOUT') {
          this.logout = row.onoma;
          this.logoutIcon = row.upload;
        }
      });
    });

  }

  declareGroups(navBarFields: FormViewModel[]): void {
    navBarFields.forEach(row => {
      if (row.typos === 'ACTIONS') {
        this.actionHeader = row.onoma;
      }
    });
  }

  findOrderInfo(orderId: any, currentUser: any): void {
    this.orderControllerService.getOrderByUserNameAndOrderId(currentUser, orderId).subscribe(res => {
      this.orderInfo = res;
    });
  }

  getLoggedInUser(currentUser: any): any {
    this.userControllerService.fetchUserByUsername(currentUser.slice(1, -1)).subscribe(res => {
      this.userDtoModel = res;
      this.userInfoLoaded = true;
    });
  }

}
