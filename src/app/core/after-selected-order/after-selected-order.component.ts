import { Component, OnInit } from '@angular/core';
import {ProjectControllerService} from '../../shared/Injectables/services/project-controller.service';
import {ProjectResponseDtoModel} from '../../shared/models/project-response-dto.model';
import {FormService} from '../../shared/Injectables/services/form.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-after-selected-order',
  templateUrl: './after-selected-order.component.html',
  styleUrls: ['./after-selected-order.component.scss']
})
export class AfterSelectedOrderComponent implements OnInit {

  projectId: any;
  currentUser: any;
  currentLang: any;

  /** parameters for titles before order info */
  companyName: any;
  orderType: any;
  status: any;
  year: any;
  orderIdTitle: any;

  projectInfo: ProjectResponseDtoModel = Object.create(null);

  constructor(private projectControllerService: ProjectControllerService,
              private formService: FormService,
              private router: Router) { }

  ngOnInit(): void {
    this.projectId = Number(this.router.url.split('/')[3]);
    this.currentUser = localStorage.getItem('currentUser');
    this.currentLang = this.router.url.split('/')[1];
    this.findOrderInfo(this.projectId, this.currentUser);
    this.getElementsFromDataBase();
  }

  findOrderInfo(projectId: any, currentUser: any): void {
    this.projectControllerService.getOrderByUserNameAndOrderId(currentUser, projectId).subscribe(res => {
      this.projectInfo = res;
    });
  }

  getElementsFromDataBase(): void {
    this.formService.getFormViewModel('AFTER ORDER SELECTED', this.currentLang, 'T').subscribe(res => {
      res.forEach(row => {
        if (row.typos === 'COMPANY NAME') {
          this.companyName = row.onoma;
        } else if (row.typos === 'ORDER TYPE') {
          this.orderType = row.onoma;
        } else if (row.typos === 'STATUS') {
          this.status = row.onoma;
        } else if (row.typos === 'YEAR') {
          this.year = row.onoma;
        } else if (row.typos === 'ORDERID') {
          this.orderIdTitle = row.onoma;
        }
      });
    });
  }
}
