import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormViewModel} from '../../shared/models/general-form-view-models/form-view.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FormService} from '../../shared/Injectables/services/form.service';
import {ProjectControllerService} from '../../shared/Injectables/services/project-controller.service';
import {MatDialog} from '@angular/material/dialog';
import {UserControllerService} from '../../shared/Injectables/services/user-controller.service';
import {UserDtoModel} from '../../shared/models/acceptance/member/user-dto.model';
import {ProjectResponseDtoModel} from "../../shared/models/project-response-dto.model";
import {OpenFormFieldsComponent} from "../open-form-fields/open-form-fields.component";

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss']
})
export class ProjectTableComponent implements OnInit, AfterViewInit {

  projects: ProjectResponseDtoModel[] = [];

  currentLang: any;
  currentUser: any;
  tableName = 'HOME'; // we are at HOME table from db
  formViewFields: FormViewModel[] = [];
  projectTableFields: FormViewModel[] = [];

  noDataMessage: any;
  loading = true;

  displayedColumns: any[] = [];

  /** table with form array from table forms */
  formsFields: FormViewModel[] = [];
  formHeader = new FormViewModel();

  loggedInUser: UserDtoModel = Object.create(null);

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private formService: FormService,
              private projectControllerService: ProjectControllerService,
              private userControllerService: UserControllerService,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private cdr: ChangeDetectorRef) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.currentLang =  this.router.url.split('/')[1];
    this.currentUser = localStorage.getItem('currentUser');
    this.getFormFields();
    this.setMemberId(this.currentUser);
    this.onInitCheckLang(this.currentLang);
  }

  ngAfterViewInit(): any {
    this.cdr.detectChanges();
  }

  getFormFields(): any {
    this.formService.getFormViewModel(this.tableName, this.currentLang, 'T').subscribe(res => {
      this.formViewFields = res;
      this.loading = false;
      this.declarationOfFields(this.formViewFields);
    });
  }

  declarationOfFields(homeFormList: FormViewModel[]): any {
    homeFormList.forEach(res => {
      if (res.typos === 'PROJECT HEADERS') {
        this.displayedColumns.push(res.keli);
        this.projectTableFields.push(res);
      }
      if (res.typos === 'FORMS HEADER') {
        this.formHeader = res;
      }
    });
  }

  openSequence(project: any): any {
    this.router.navigate([this.currentLang, 'home', project.id]);
  }

  setMemberId(currentUser: any): any {
    const currentUserName = currentUser.slice(1, -1);
    this.userControllerService.fetchUserByUsername(currentUserName).subscribe((res: UserDtoModel) => {
      if (res !== null) {
        this.loggedInUser = res;
        if (this.loggedInUser.authorities !== 'ROLE_ADMIN') {
          this.getData(this.currentUser);
        }
        if (this.loggedInUser.authorities === 'ROLE_ADMIN') {
          this.getFormsTable(this.currentLang);
        }
        // @ts-ignore
        localStorage.setItem('memberId', res.id.toString());
        localStorage.setItem('userEmail', res.email);
      }
    });
  }

  onInitCheckLang(currentLang: any): any {
    if (currentLang === 'el') {
      this.noDataMessage = 'Δεν υπάρχουν εγγραφές για:';
    } else {
      this.noDataMessage = 'There are no results for:';
    }
  }

  getData(userName: string): any {
    this.projectControllerService.findProjectsByMemberUsername(userName).subscribe(res => {
      this.projects = res;
      this.loading = false;
    });
  }

  getFormsTable(currentLang: any): any {
    this.formService.findAllTableNames(currentLang).subscribe(res => {
      this.formsFields = res;
    });
  }

  openFormFields(formName: string): any {
    const dialogRef = this.dialog.open(OpenFormFieldsComponent, {
      width: 'fit-content',
      height: 'fit-content',
      data: {
        tableName: formName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Yes') {
        this.getData(this.currentUser);
      }
    });
  }
}
