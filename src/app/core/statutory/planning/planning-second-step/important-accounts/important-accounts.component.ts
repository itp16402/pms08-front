import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EditAcceptanceComponent} from '../../../../../shared/shared-componets/edit-acceptance/edit-acceptance.component';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FormListDtoModel} from '../../../../../shared/models/general-form-view-models/form-list-dto.model';
import {FormListControllerService} from '../../../../../shared/Injectables/services/form-list-controller.service';
import {FormRoleControllerService} from '../../../../../shared/Injectables/services/form-role-controller.service';
import {ImportantAccountControllerService} from '../../../../../shared/Injectables/services/planning/step-2-service/important-account-controller.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {FormService} from '../../../../../shared/Injectables/services/form.service';
import {FormViewModel} from '../../../../../shared/models/general-form-view-models/form-view.model';
import {ImportantAccountDto} from '../../../../../shared/models/planning/important-account-221/important-account-dto';
import {MailService} from '../../../../../shared/Injectables/services/mail.service';
import {CompleteModalComponent} from './complete-modal/complete-modal.component';

@Component({
  selector: 'app-important-accounts',
  templateUrl: './important-accounts.component.html',
  styleUrls: ['./important-accounts.component.scss']
})
export class ImportantAccountsComponent implements OnInit, AfterViewInit {

  currentLang: any;
  orderId: any;
  selectedTable: any;
  formGroup: FormGroup = Object.create(null);
  initialised = false;
  /** important account model in order to bind its value into formGroup and then manipulate it as user wants */
  importantAccountDto: ImportantAccountDto = Object.create(null);
  loadImportantAccountDto = false;

  /** parameters for display the header, info, help, video and pdf information */
  formTitle = new FormViewModel();

  /** parameters for buttons */
  saveButton = new FormViewModel();
  editButton = new FormViewModel();
  completeButton = new FormViewModel();
  returnButton = new FormViewModel();

  /** header for table in order to display the wanted data with tableName from add231 table */
  displayHeadersForAdd231Table: any[] = [];
  displayColumnsForAdd231Table: any[] = [];
  yFormField = new FormViewModel();
  pdFormField = new FormViewModel();
  akFormField = new FormViewModel();
  apFormField = new FormViewModel();
  ddFormField = new FormViewModel();
  tpFormField = new FormViewModel();

  /** important account field from dataBase */
  importantAccountFields: FormViewModel[] = [];

  /** formListId and boolean parameter in order to check if the formListId is not null */
  formList: FormListDtoModel = Object.create(null);
  loadingFormList = false;


  /** boolean for important selection check */
  importantChecked = false;

  /** PARAMETERS IN ORDER TO CHECK MEMBER ROLE */
  memberId: any;
  memberCanMakeChangesIntoForm = false;
  userEmail: any;

  constructor(private formListControllerService: FormListControllerService,
              private formRoleControllerService: FormRoleControllerService,
              private formService: FormService,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private mailService: MailService,
              private cdf: ChangeDetectorRef,
              private importantAccountControllerService: ImportantAccountControllerService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.currentLang =  this.router.url.split('/')[1];
    this.orderId = Number(this.router.url.split('/')[3]);
    this.memberId = localStorage.getItem('memberId');
    this.userEmail = localStorage.getItem('userEmail');
    this.selectedTable = this.activatedRoute.snapshot.params.tableName;
    this.getButtons();
    this.getFormFields();
    this.getFormListId(this.selectedTable);
  }

  ngAfterViewInit(): void {
    this.cdf.detectChanges();
  }

  getButtons(): void {
    this.formService.getFormViewModel('BUTTONS', this.currentLang, 'T').subscribe(res => {
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

  getAdd231FormViewModel(): void {
    this.formService.findFormsByTableNameAndOrderId('add231', this.currentLang, this.orderId).subscribe(res => {
      res.forEach(row => {
        this.displayHeadersForAdd231Table.push(row.onoma);
        this.displayColumnsForAdd231Table.push(row.keli);
        if (row.typos === 'A6') {
          this.yFormField = row;
        }
        if (row.typos === 'A7') {
          this.pdFormField = row;
        }
        if (row.typos === 'A8') {
          this.akFormField = row;
        }
        if (row.typos === 'A9') {
          this.apFormField = row;
        }
        if (row.typos === 'A10') {
          this.ddFormField = row;
        }
        if (row.typos === 'A11') {
          this.tpFormField = row;
        }
      });
    });
  }

  getFormFields(): void {
    this.formService.findFormsByTableNameAndOrderId(this.selectedTable, this.currentLang, this.orderId).subscribe(res => {
      this.importantAccountFields = res;
      this.getAdd231FormViewModel();
      this.declarationOfTitles(this.importantAccountFields);
    });
  }

  declarationOfTitles(importantAccountFields: FormViewModel[]): void {
    importantAccountFields.forEach(row => {
      if (row.typos === 'TITLE') {
        this.formTitle = row;
      }
    });
  }

  getFormListId(formName: string): void {
    this.formListControllerService.getFormByName(formName).subscribe(res => {
      this.formList = res;
      this.checkMemberRole(this.memberId, this.orderId, this.formList);
      this.loadingFormList = false;
      this.getData(this.orderId, this.formList);
    });
  }

  checkMemberRole(memberId: any, orderId: any, formList: FormListDtoModel): any{
    if (formList !== null) {
      this.formRoleControllerService.checkIfMemberIsAssignedInForm(memberId, orderId, formList.id).subscribe(res => {
        this.memberCanMakeChangesIntoForm = res;
      });
    }
  }

  getData(orderId: number, selectedForm: FormListDtoModel): void {
    this.importantAccountControllerService.fetchImportantAccountByOrderSamId(orderId, selectedForm.id)
      .subscribe(res => {
        this.importantAccountDto = res;
        this.loadImportantAccountDto = true;
        this.initialize();
      });
  }

  initialize(): void {
    this.formGroup = this.fb.group({
      id: new FormControl(null),
      importantAccountAddRequestDtoList: this.fb.array([]),
      status: new FormControl(null)
    });

    if (this.importantAccountDto !== null && this.loadImportantAccountDto) {
      this.formGroup.controls.id.patchValue(this.importantAccountDto?.id);
      this.formGroup.controls.status.patchValue(this.importantAccountDto?.status);
      if (this.importantAccountDto?.importantAccountAddDtoList?.length !== 0) {
        this.importantAccountDto?.importantAccountAddDtoList?.forEach(account => {
          const accountFormGroup = this.createImportantAccountAddFormGroup();
          accountFormGroup.patchValue(account);
          accountFormGroup.controls.isEditable.patchValue(false);
          (this.formGroup.controls.importantAccountAddRequestDtoList as FormArray).push(accountFormGroup);
        });
      }
      this.initialised = true;
    } else {
      this.initialised = false;
    }
  }

  createImportantAccountAddFormGroup(): any {
    return this.fb.group({
      id: new FormControl(null),
      lineId: new FormControl(null),      // id of economic line (we may not use)
      lineName: new FormControl(null),    // name of economic line
      amount: new FormControl(null),      // amount of economic line
      essential: new FormControl(false),
      important: new FormControl(false),
      y: new FormControl(0),
      pd: new FormControl(0),
      ak: new FormControl(0),
      ap: new FormControl(0),
      dd: new FormControl(0),
      tp: new FormControl(0),
      assessment: new FormControl(false),
      importantAssessment: new FormControl(null),
      importantRisk: new FormControl(null),
      isEditable: new FormControl(true)
    });
  }

  save(): void {
    this.formGroup.controls.status.setValue('SAVED');
    if (this.formList.id != null) {
      this.importantAccountControllerService.saveImportantAccount(this.orderId, this.formList.id, this.formGroup.value)
        .subscribe(res => {
          this.getData(this.orderId, this.formList);
        });
    }
  }

  back(): void {
    this.router.navigate([this.currentLang, 'home', this.orderId, 'statutory', 'planning', 'planning-second-step']);
  }

  complete(): void {
    if (!this.loadingFormList && this.formList.id != null) {
      this.completeModal();
    }
  }

  completeModal(): any {
    const dialogRef = this.dialog.open(CompleteModalComponent, {
      width: 'fit-content',
      height: 'fit-content'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.sendMail(this.orderId);
      }
    });

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
        this.importantAccountControllerService.saveImportantAccount(this.orderId, this.formList.id, this.formGroup.value)
          .subscribe(res => {
            this.getData(this.orderId, this.formList);
          });
      }
    });
  }

  removeHelpField(keli: any): any {
    if (keli !== null) {
      // @ts-ignore
      document.getElementById(keli).style.display = 'none';
    }
  }

  editRow(group: any): any {
    if (group !== null) {
      group.get('isEditable').setValue(true);
      if (group.get('important').value) {
        this.importantChecked = true;
      }
    }
  }

  doneRow(group: any): any {
    if (group !== null) {
      group.get('isEditable').setValue(false);
      // const importantAccount: any = Object.create(null);
      // importantAccount.importantAccountAddRequestDtoList = [group.value];
      // importantAccount.id = this.formGroup.controls.id.value;
      this.formGroup.controls.status.setValue('SAVED');
      // importantAccount.status = this.formGroup.controls.status.value;
      this.importantAccountControllerService.saveImportantAccount(this.orderId, this.formList.id, this.formGroup.value)
        .subscribe(res => {
          this.getData(this.orderId, this.formList);
        });
    }
  }

  importantChange(group: any, formGroupCellValue: any): void {
    this.importantChecked = formGroupCellValue;
    if (!formGroupCellValue) {
      group.get('y').setValue(formGroupCellValue);
      group.get('pd').setValue(formGroupCellValue);
      group.get('ak').setValue(formGroupCellValue);
      group.get('ap').setValue(formGroupCellValue);
      group.get('dd').setValue(formGroupCellValue);
      group.get('tp').setValue(formGroupCellValue);
      group.get('assessment').setValue(formGroupCellValue);
    }
  }

  changeFormControlValue(group: any, formGroupCell: string): any {
    if (group.get(formGroupCell).value === 1) {
      group.get(formGroupCell).setValue(0);
    } else {
      group.get(formGroupCell).setValue(1);
    }
  }

  changeGroupFieldValue(group: any, formGroupCell: string): any {
    if (group.get(formGroupCell).value === false) {
      group.get(formGroupCell).setValue(true);
    } else {
      group.get(formGroupCell).setValue(false);
    }
    if (formGroupCell === 'important') {
      this.importantChange(group, group.get(formGroupCell).value);
    }
  }

  return(group: any): any {
    if (group !== null) {
      group.get('isEditable').setValue(false);
      this.getData(this.orderId, this.formList);
    }
  }

  checkUserCanSaveGroup(group: any): any {
    if (group.get('important').value === true && group.get('assessment').value === true) {
      if (group.get('y').value === 1 || group.get('pd').value === 1 || group.get('ak').value === 1 ||
        group.get('ap').value === 1 || group.get('dd').value === 1 || group.get('tp').value === 1 ) {
        return true;
      }
    } else if (group.get('important').value === true && group.get('assessment').value === false) {
      if (group.get('y').value === 1 || group.get('pd').value === 1 || group.get('ak').value === 1 ||
        group.get('ap').value === 1 || group.get('dd').value === 1 || group.get('tp').value === 1 ) {
        return true;
      }
    } else if (group.get('important').value === false && group.get('assessment').value === false) {
      if (group.get('y').value === 1 && group.get('pd').value === 1 && group.get('ak').value === 1 &&
        group.get('ap').value === 1 && group.get('dd').value === 1 && group.get('tp').value === 1 ) {
        return true;
      }
    } else if (group.get('important').value === true) {
      if (group.get('y').value === 1 && group.get('pd').value === 1 && group.get('ak').value === 1 &&
        group.get('ap').value === 1 && group.get('dd').value === 1 && group.get('tp').value === 1 ) {
        return false;
      }
    }
  }

  sendMail(orderId: any): any{
    const mailBody = Object.create(null);
    mailBody.from = 'itp16402@hua.gr';
    mailBody.subject = 'Ολοκλήρωση Εργασίας';
    mailBody.text = 'Η εργασία με αριθμό ' + orderId + ' ολοκληρώθηκε επιτυχώς';
    mailBody.to = this.userEmail;
    this.mailService.sendMail(mailBody).subscribe(res => {
      if (res === null) {
        this.formGroup.controls.status.setValue('COMPLETED');
        this.importantAccountControllerService.saveImportantAccount(this.orderId, this.formList.id, this.formGroup.value)
          .subscribe(response => {
            if (response === null) {
              this.router.navigate([this.currentLang, 'home', this.orderId, 'statutory', 'planning', 'planning-second-step']);
            }
          });
      }
    });
  }

}
