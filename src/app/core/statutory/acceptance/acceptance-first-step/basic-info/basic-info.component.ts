import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ProjectControllerService} from '../../../../../shared/Injectables/services/project-controller.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormService} from '../../../../../shared/Injectables/services/form.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {BasicInfoControllerService} from '../../../../../shared/Injectables/services/acceptance/basic-info-controller.service';
import {FormViewModel} from '../../../../../shared/models/general-form-view-models/form-view.model';
import {BasicInfoDtoModel} from '../../../../../shared/models/acceptance/basic-info/basic-info-dto.model';
import {EditAcceptanceComponent} from '../../../../../shared/shared-componets/edit-acceptance/edit-acceptance.component';
import {FormListControllerService} from '../../../../../shared/Injectables/services/form-list-controller.service';
import {FormListDtoModel} from '../../../../../shared/models/general-form-view-models/form-list-dto.model';
import {DateAdapter} from '@angular/material/core';
import {ProjectResponseDtoModel} from '../../../../../shared/models/project-response-dto.model';
import {FormRoleControllerService} from '../../../../../shared/Injectables/services/form-role-controller.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit, AfterViewInit {

  @ViewChild('UploadFileInput') uploadFileInput: ElementRef = Object.create(null);

  currentLang: any;
  currentUser: any;
  projectId: any;
  selectedTable: any;
  formGroup: FormGroup = Object.create(null);

  initialised = false;

  basicInfoFormFields: FormViewModel[] = [];
  radioButtonsFieldsList: FormViewModel[] = [];
  radioEconomic: FormViewModel[] = [];
  radioEntityType: FormViewModel[] = [];

  saveButton = new FormViewModel();
  editButton = new FormViewModel();
  completeButton = new FormViewModel();
  returnButton = new FormViewModel();

  basicList: BasicInfoDtoModel = Object.create(null);
  formTitle = new FormViewModel();
  selectedForm: FormListDtoModel = Object.create(null);
  loadingFormList = true;

  projectResponseDtoModel: ProjectResponseDtoModel = Object.create(null);

  /** PARAMETERS IN ORDER TO CHECK MEMBER ROLE */
  memberId: any;
  memberCanMakeChangesIntoForm = false;

  constructor(private projectControllerService: ProjectControllerService,
              private basicInfoControllerService: BasicInfoControllerService,
              private formListControllerService: FormListControllerService,
              private formRoleControllerService: FormRoleControllerService,
              private dateAdapter: DateAdapter<any>,
              private formsService: FormService,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private cdf: ChangeDetectorRef) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('currentUser');
    this.currentLang =  this.router.url.split('/')[1];
    this.projectId = Number(this.router.url.split('/')[3]);
    this.memberId = localStorage.getItem('memberId');
    this.selectedTable = this.activatedRoute.snapshot.params.tableName;
    this.createForm();
    this.getFormFields();
    this.getButtons();
    this.getFormListId(this.selectedTable);
    this.changeDatePicker(this.currentLang);
    this.getRadioButtons();
    this.getOrderInfo(this.projectId, this.currentUser);
  }

  ngAfterViewInit(): void {
    this.cdf.detectChanges();
  }

  checkMemberRole(memberId: any, projectId: any, selectedForm: FormListDtoModel): any{
    if (selectedForm !== null) {
      this.formRoleControllerService.checkIfMemberIsAssignedInForm(memberId, projectId, selectedForm.id).subscribe(res => {
        this.memberCanMakeChangesIntoForm = res;
      });
    }
  }

  createForm(): void {
    this.formGroup = this.fb.group({
      id: new FormControl(null, Validators.required),
      acceptance: new FormControl(null, Validators.required),
      agreementDate: new FormControl(null, Validators.required),
      appointmentDate: new FormControl(null),
      archivingDate: new FormControl(null, Validators.required),
      balanceSheetType: new FormControl(null, Validators.required),
      branch: new FormControl(null, Validators.required),
      consecutiveYears: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      financialStatementsDate: new FormControl(null, Validators.required),
      hours: new FormControl(null, Validators.compose([Validators.required, Validators.max(300)])),
      letterDate: new FormControl(null, Validators.required),
      reportDate: new FormControl(null),
      startDate: new FormControl(null, Validators.required),
      turnover: new FormControl(null),
      status: new FormControl(null, Validators.required)
    });
  }

  getOrderInfo(projectId: any, currentUser: any): void {
    this.projectControllerService.getOrderByUserNameAndOrderId(currentUser, projectId).subscribe(res => {
      this.projectResponseDtoModel = res;
    });
  }

  getFormFields(): void {
    this.formsService.findFormsByTableNameAndOrderId(this.selectedTable, this.currentLang, this.projectId).subscribe(res => {
      this.basicInfoFormFields = res;
      this.declarationOfTitles(this.basicInfoFormFields);
    });
  }

  getButtons(): void {
    this.formsService.getFormViewModel('BUTTONS', this.currentLang, 'T').subscribe(res => {
      res.forEach(row => {
        if (row.typos === 'SAVE') {
          this.saveButton = row;
        }
        if (row.typos === 'EDIT') {
          this.editButton = row;
        }
        if (row.typos === 'RETURN') {
          this.returnButton = row;
        }
        if (row.typos === 'COMPLETE') {
          this.completeButton = row;
        }
      });
    });
  }

  getRadioButtons(): void {
    this.formsService.findFormsByTableNameAndOrderId('RADIOBUTTONS', this.currentLang, this.projectId).subscribe(res => {
      this.radioButtonsFieldsList = res;
      this.separationFields(this.radioButtonsFieldsList);
    });
  }

  getFormListId(formName: string): void {
    this.formListControllerService.getFormByName(formName).subscribe(res => {
      this.selectedForm = res;
      this.loadingFormList = false;
      this.checkMemberRole(this.memberId, this.projectId, this.selectedForm);
      this.getData(this.projectId, this.selectedForm);
    });
  }

  getData(projectId: any, selectedForm: any): void {
    if (selectedForm != null) {
      this.basicInfoControllerService.getBasicOrder(projectId, selectedForm.id).subscribe(res => {
        this.basicList = res;
        this.initialised = true;
        if (this.basicList !== null) {
          this.formGroup.patchValue(this.basicList);
        }
      });
    }
  }

  declarationOfTitles(basicInfoFormFields: FormViewModel[]): void {
    basicInfoFormFields.forEach(row => {
      if (row.typos === 'TITLE') {
        this.formTitle = row;
      }
    });
  }

  separationFields(radioButtonsFieldsList: FormViewModel[]): void {
    radioButtonsFieldsList.forEach( row => {
      if (row.typos === 'ENTITY_TYPE') {
        this.radioEntityType.push(row);
      }
      if (row.typos === 'ECONOMIC_SITUATION') {
        this.radioEconomic.push(row);
      }
    });
  }

  save(): void {
    this.formGroup.controls.status.setValue('SAVED');
    if (!this.loadingFormList && this.selectedForm.id != null) {
      this.basicInfoControllerService.saveBasicInfoByProjectId(this.formGroup.value, this.projectId, this.selectedForm.id).subscribe(res => {
        this.getData(this.projectId, this.selectedForm);
      });
    }
  }

  back(): void {
    this.router.navigate([this.currentLang, 'home', this.projectId, 'statutory', 'acceptance', 'acceptance-first-step']);
  }

  complete(): void {
    if (!this.loadingFormList && this.selectedForm.id != null) {
      this.formGroup.controls.status.setValue('COMPLETED');
      this.basicInfoControllerService.saveBasicInfoByProjectId(this.formGroup.value, this.projectId, this.selectedForm.id).subscribe(res => {
        this.router.navigate([this.currentLang, 'home', this.projectId, 'statutory', 'acceptance', 'acceptance-second-step', '1', 'a121']);
      });
    }
  }

  edit(): void {
    this.openEditModal();
  }

  openEditModal(): any {
    const dialogRef = this.dialog.open(EditAcceptanceComponent, {
      width: 'fit-content',
      height: 'fit-content'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.formGroup.controls.status.setValue('PROCESSED');
        if (!this.loadingFormList && this.selectedForm.id != null) {
          this.basicInfoControllerService.saveBasicInfoByProjectId(this.formGroup.value, this.projectId, this.selectedForm.id).subscribe(res => {
            this.getData(this.projectId, this.selectedForm);
          });
        }
      }
    });
  }

  changeDatePicker(currentLang: any): void {
    if (currentLang === 'el') {
      this.dateAdapter.setLocale('el-GR');
    } else {
      this.dateAdapter.setLocale('en-US');
    }
  }

  removeHelpField(keli: any): any {
    if (keli !== null) {
      // @ts-ignore
      document.getElementById(keli).style.display = 'none';
    }
  }

  changeGroupFieldValue(field: any, formControlValue: any, group: any): any {
    if (field) {
      if (formControlValue === 1) {
        group.controls[field.keli].setValue(0);
      } else {
        group.controls[field.keli].setValue(1);
      }
    }
  }
}
