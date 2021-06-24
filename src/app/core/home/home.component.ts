import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../shared/Injectables/services/login.service';
import {FlowchartControllerService} from '../../shared/Injectables/services/flowchart-controller.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  currentLang: any;
  currentUser: any;
  selectedOrderId: any;
  url: any;

  constructor(private flowchartControllerService: FlowchartControllerService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public loginService: LoginService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.url = this.router.url.split('/')[2];
    this.currentLang = this.router.url.split('/')[1];
    this.selectedOrderId = this.activatedRoute.snapshot.paramMap.get('id');
    this.currentUser = localStorage.getItem('currentUser');
  }

  ngAfterViewInit(): void {

  }


}
