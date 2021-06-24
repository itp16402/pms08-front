import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormViewModel} from '../../../../../shared/models/general-form-view-models/form-view.model';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {FormListControllerService} from '../../../../../shared/Injectables/services/form-list-controller.service';
import {FormService} from '../../../../../shared/Injectables/services/form.service';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {EditAcceptanceComponent} from '../../../../../shared/shared-componets/edit-acceptance/edit-acceptance.component';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {EssentialSizeControllerService} from '../../../../../shared/Injectables/services/planning/step-1-service/essential-size-controller.service';
import {EssentialSizeDtoModel} from '../../../../../shared/models/planning/essential-size-211/essential-size-dto.model';
import {BaseResponseDtoModel} from '../../../../../shared/models/planning/essential-size-211/base-response-dto.model';
import {FormRoleControllerService} from '../../../../../shared/Injectables/services/form-role-controller.service';
import {FormListDtoModel} from '../../../../../shared/models/general-form-view-models/form-list-dto.model';

@Component({
  selector: 'app-essential-size',
  templateUrl: './essential-size.component.html',
  styleUrls: ['./essential-size.component.scss']
})
export class EssentialSizeComponent implements OnInit, AfterViewInit {

  currentLang: any;
  projectId: any;
  selectedTable: any;
  /** Object only for take the form id and pass it at all http calls */
  formList: any = Object.create(null);
  /** parameters for display the header, info, help, video and pdf information */
  formTitle = new FormViewModel();
  videoTitle: any;
  pdfTitle: any;

  /** parameters for buttons */
  saveButton = new FormViewModel();
  editButton = new FormViewModel();
  completeButton = new FormViewModel();
  returnButton = new FormViewModel();

  /** add button title */
  addButtonTitle = new FormViewModel();

  /** declaration of formGroup with which I will handle all user changes */
  formGroup: FormGroup = Object.create(null);
  initialised = false;

  /** load all fields from data base corresponding to information table (a212) */
  formFieldsList: FormViewModel[] = [];

  /** Data for the table add221overall */
  add221overallHasNoData = new BehaviorSubject<boolean>(true);
  tableHeadersAdd221overallFinal: any[] = [];
  add221overallLoaded = false;
  /** Data for the table add221performance */
  add221performanceList: FormViewModel[] = [];
  add221performanceHasNoData = new BehaviorSubject<boolean>(true);
  tableHeadersAdd221performance: any[] = [];
  add221performanceLoaded = false;

  /** Information System object initialization */
  essentialSizeModel: EssentialSizeDtoModel = Object.create(null);

  noResults: any;

  /** parameter in order to load all radio button from database */
  radioButtonsFieldsList: FormViewModel[] = [];
  /** Materiality base list for the selected object of list and radio yes no for specific materiality radio button */
  allBases: BaseResponseDtoModel[] = [];
  specificCategoryRadioButton: FormViewModel[] = [];

  /** custom tooltip for error in overall materiality */
  minValue: any;
  maxValue: any;

  /** PARAMETERS IN ORDER TO CHECK MEMBER ROLE */
  memberId: any;
  memberCanMakeChangesIntoForm = false;

  constructor(private formListControllerService: FormListControllerService,
              private formRoleControllerService: FormRoleControllerService,
              private formService: FormService,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private cdf: ChangeDetectorRef,
              private essentialSizeControllerService: EssentialSizeControllerService,) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.selectedTable = this.activatedRoute.snapshot.params.tableName;
    /** get lang from url */
    this.currentLang = this.router.url.split('/')[1];
    this.projectId = Number(this.router.url.split('/')[3]);
    this.memberId = localStorage.getItem('memberId');
    this.checkNoResultsMsg(this.currentLang);
    this.getButtons();
    this.getRadioButtons();
    this.getFormListId(this.selectedTable);
    this.getFormViewModels(this.selectedTable, this.projectId, this.currentLang);
  }

  ngAfterViewInit(): void {
    this.cdf.detectChanges();
  }

  checkNoResultsMsg(currentLang: any): void {
    if (currentLang === 'el') {
      this.noResults = 'Δεν υπάρχουν εγγραφές.';
    } else {
      this.noResults = 'There are no data.';
    }
  }

  getBaseList(projectId: number, lang: string): void{
    this.essentialSizeControllerService.fetchBaseList(projectId, lang).subscribe(res => {
      this.allBases = res;
    });
  }

  getFormListId(table: string): void {
    this.formListControllerService.getFormByName(table).subscribe(res => {
      this.formList = res;
      this.checkMemberRole(this.memberId, this.projectId, this.formList);
      if (this.formList) {
        this.getData(this.projectId);
      }
    });
  }

  checkMemberRole(memberId: any, orderId: any, formList: FormListDtoModel): any{
    if (formList !== null) {
      this.formRoleControllerService.checkIfMemberIsAssignedInForm(memberId, orderId, formList.id).subscribe(res => {
        this.memberCanMakeChangesIntoForm = res;
      });
    }
  }

  getFormViewModels(table: string, orderId: number, lang: string): void {
    this.formService.findFormsByTableNameAndOrderId(table, lang, orderId).subscribe(res => {
      this.formFieldsList = res;
      this.formFieldsList.forEach(row => {
        if (row.typos === 'TITLE') {
          this.formTitle = row;
        }
        if (row.typos === 'PDF HELP') {
          this.pdfTitle = row.onoma;
        }
        if (row.typos === 'VIDEO HELP') {
          this.videoTitle = row.onoma;
        }
        if (row.typos === 'MAXVALUE') {
          this.maxValue = row.onoma;
        }
        if (row.typos === 'MINVALUE') {
          this.minValue = row.onoma;
        }
        if (row.typos === 'ADD BUTTON TITLE') {
          this.addButtonTitle = row;
        }
      });
    });

    this.formService.getFormViewModel('add221overall', lang, 'T').subscribe(res => {
      res.forEach((row: FormViewModel) => {
        if (row.typos === 'TABLE FINAL') {
          this.tableHeadersAdd221overallFinal.push(row.onoma);
        }
      });
    });

    this.formService.getFormViewModel('add221performance', lang, 'T').subscribe(res => {
      this.add221performanceList = res;
      this.add221performanceLoaded = true;
      this.add221performanceList.forEach(row => {
        this.tableHeadersAdd221performance.push(row.onoma);
      });
    });
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

  getRadioButtons(): void {
    this.formService.findFormsByTableNameAndOrderId('RADIOBUTTONS', this.currentLang, this.projectId).subscribe(res => {
      this.radioButtonsFieldsList = res;
      this.separationFields(this.radioButtonsFieldsList);
    });
  }

  separationFields(radioButtonsFieldsList: FormViewModel[]): void {
    radioButtonsFieldsList.forEach(row => {
      if (row.typos === 'SPECIFIC_CATEGORY') {
        this.specificCategoryRadioButton.push(row);
      }
    });
  }

  getData(projectId: any): void {
    if (this.formList) {
      this.getBaseList(this.projectId, this.currentLang);
      this.essentialSizeControllerService.fetchEssentialSizeByProjectId(projectId, this.formList.id, this.currentLang)
        .subscribe(res => {
          this.essentialSizeModel = res;
          this.initialize();
        });
    }
  }

  /** at this form there are not validators set yet, cause we have to see what is going on with Giannis */
  createForm(): any {
    this.formGroup = this.fb.group({
      baseId: new FormControl('', Validators.required),
      documentationBase: new FormControl(null, Validators.required),
      documentationPerformance: new FormControl(null),
      overAmount: new FormControl(null),
      taxOverAmount: new FormControl('', Validators.required),
      essentialSizeOverallDtoList: this.fb.array([]),
      essentialSizePerformanceDtoList: this.fb.array([]),
      id: new FormControl(null),
      status: new FormControl(null)
    });
  }

  initialize(): any {
    this.createForm();
    if (this.essentialSizeModel !== null) {
      if (this.essentialSizeModel.base !== null) {
        this.formGroup.controls.baseId.patchValue(this.essentialSizeModel.base.id);
      }
      this.formGroup.controls.documentationBase.patchValue(this.essentialSizeModel.documentationBase);
      this.formGroup.controls.overAmount.patchValue(this.essentialSizeModel.overAmount);
      this.formGroup.controls.taxOverAmount.patchValue(this.essentialSizeModel.taxOverAmount);
      this.formGroup.controls.id.patchValue(this.essentialSizeModel.id);
      this.formGroup.controls.status.patchValue(this.essentialSizeModel.status);

      if (this.essentialSizeModel.essentialSizeOverallDtoList.length !== 0) {
        this.essentialSizeModel.essentialSizeOverallDtoList.forEach(overall => {
          const add221overall = this.createAdd221overall();
          add221overall.patchValue(overall);
          add221overall.controls.isEditableA5.patchValue(false);
          add221overall.controls.isEditable.setValue(false);
          (this.formGroup.controls.essentialSizeOverallDtoList as FormArray).push(add221overall);
          if (overall.base.toString() === this.formGroup.controls.baseId.value) {
            this.formGroup.controls.baseId.patchValue(overall.base.id);
          }
        });
        this.add221overallLoaded = true;
        this.add221overallHasNoData.next(this.formGroup.value.essentialSizeOverallDtoList.length === 0);
      } else {
        const add221overall = this.createAdd221overall();
        add221overall.controls.isEditableA5.patchValue(false);
        add221overall.controls.isEditable.setValue(false);
        (this.formGroup.controls.essentialSizeOverallDtoList as FormArray).push(add221overall);
        this.add221overallLoaded = true;
        this.add221overallHasNoData.next(this.formGroup.value.essentialSizeOverallDtoList.length === 0);
      }

      if (this.essentialSizeModel.essentialSizePerformanceDtoList.length !== 0) {
        this.essentialSizeModel.essentialSizePerformanceDtoList.forEach(performance => {
          const dd221performance = this.createAdd221performance();
          dd221performance.patchValue(performance);
          dd221performance.controls.isEditable.patchValue(false);
          (this.formGroup.controls.essentialSizePerformanceDtoList as FormArray).push(dd221performance);
        });
        this.add221performanceHasNoData.next(this.formGroup.value.essentialSizePerformanceDtoList.length === 0);
        this.add221performanceLoaded = true;
      } else {
        const add221performance = this.createAdd221performance();
        add221performance.controls.isEditable.patchValue(false);
        (this.formGroup.controls.essentialSizePerformanceDtoList as FormArray).push(add221performance);
        this.add221performanceHasNoData.next(this.formGroup.value.essentialSizePerformanceDtoList.length === 0);
        this.add221performanceLoaded = true;
      }

      this.initialised = true;

    } else {
      this.initialised = true;
    }
  }

  save(): void {
    if (this.formGroup.value !== null) {
      let overAmount: any;
      let taxOverAmount: any;
      if (this?.formGroup?.get('overAmount')?.value !== null){
        const oldA5 = this?.formGroup?.get('overAmount')?.value;
        overAmount = Number(oldA5.replaceAll('.', '').replace(',', '.'));
      }
      if (this?.formGroup?.get('taxOverAmount')?.value !== null){
        const oldA5 = this?.formGroup?.get('taxOverAmount')?.value;
        taxOverAmount = Number(oldA5.replaceAll('.', '').replace(',', '.'));
      }
      this.formGroup.controls.status.setValue('SAVED');
      const sentEssentialSizeDto: EssentialSizeDtoModel = Object.create(null);
      sentEssentialSizeDto.id = this.formGroup.controls.id.value;
      sentEssentialSizeDto.status = this.formGroup.controls.status.value;
      sentEssentialSizeDto.base = this.formGroup.controls.base.value;
      sentEssentialSizeDto.documentationBase = this.formGroup.controls.documentationBase.value;
      sentEssentialSizeDto.overAmount = overAmount;
      sentEssentialSizeDto.taxOverAmount = taxOverAmount;
      sentEssentialSizeDto.essentialSizeOverallDtoList = [];
      sentEssentialSizeDto.essentialSizePerformanceDtoList = [];
      console.log(sentEssentialSizeDto);

      if (this.formList.id != null) {
        this.essentialSizeControllerService.saveEssentialSize(this.projectId, this.formList.id, sentEssentialSizeDto)
          .subscribe((res: any) => {
            this.getData(this.projectId);
          });
      }
    }
  }

  back(): void {
    this.router.navigate([this.currentLang, 'home', this.projectId, 'statutory', 'planning', 'planning-first-step']);
  }

  complete(): void {
    if (this.formGroup.value !== null) {
      let overAmount: any;
      let taxOverAmount: any;
      if (this?.formGroup?.get('overAmount')?.value !== null){
        const oldA5 = this?.formGroup?.get('overAmount')?.value;
        overAmount = Number(oldA5.replaceAll('.', '').replace(',', '.'));
      }
      if (this?.formGroup?.get('taxOverAmount')?.value !== null){
        const oldA5 = this?.formGroup?.get('taxOverAmount')?.value;
        taxOverAmount = Number(oldA5.replaceAll('.', '').replace(',', '.'));
      }
      this.formGroup.controls.status.setValue('COMPLETED');
      const sentEssentialSizeDto: EssentialSizeDtoModel = Object.create(null);
      sentEssentialSizeDto.id = this.formGroup.controls.id.value;
      sentEssentialSizeDto.status = this.formGroup.controls.status.value;
      sentEssentialSizeDto.base = this.formGroup.controls.base.value;
      sentEssentialSizeDto.documentationBase = this.formGroup.controls.documentationBase.value;
      sentEssentialSizeDto.overAmount = overAmount;
      sentEssentialSizeDto.taxOverAmount = taxOverAmount;
      sentEssentialSizeDto.essentialSizeOverallDtoList = [];
      sentEssentialSizeDto.essentialSizePerformanceDtoList = [];

      if (this.formList.id != null) {
        this.essentialSizeControllerService.saveEssentialSize(this.projectId, this.formList.id, sentEssentialSizeDto)
          .subscribe((res: any) => {
            this.router.navigate([this.currentLang, 'home', this.projectId, 'statutory', 'planning', 'planning-second-step', '1', 'a231']);
          });
      }
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
        let overAmount: any;
        let taxOverAmount: any;
        if (this?.formGroup?.get('overAmount')?.value !== null){
          const oldA5 = this?.formGroup?.get('overAmount')?.value;
          overAmount = Number(oldA5.replaceAll('.', '').replace(',', '.'));
        }
        if (this?.formGroup?.get('taxOverAmount')?.value !== null){
          const oldA5 = this?.formGroup?.get('taxOverAmount')?.value;
          taxOverAmount = Number(oldA5.replaceAll('.', '').replace(',', '.'));
        }
        this.formGroup.controls.status.setValue('PROCESSED');
        const sentEssentialSizeDto: EssentialSizeDtoModel = Object.create(null);
        sentEssentialSizeDto.id = this.formGroup.controls.id.value;
        sentEssentialSizeDto.status = this.formGroup.controls.status.value;
        sentEssentialSizeDto.base = this.formGroup.controls.base.value;
        sentEssentialSizeDto.documentationBase = this.formGroup.controls.documentationBase.value;
        sentEssentialSizeDto.overAmount = overAmount;
        sentEssentialSizeDto.taxOverAmount = taxOverAmount;
        sentEssentialSizeDto.essentialSizeOverallDtoList = [];
        sentEssentialSizeDto.essentialSizePerformanceDtoList = [];

        this.essentialSizeControllerService.saveEssentialSize(this.projectId, this.formList.id, sentEssentialSizeDto)
          .subscribe((res: any) => {
            this.getData(this.projectId);
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

  createAdd221overall(): any {
    return this.fb.group({
      id: new FormControl(null),
      base: new FormControl(null),
      interimBaseAmount: new FormControl(null),
      maxLimit: new FormControl(null),
      minLimit: new FormControl(null),
      overAmount: new FormControl(null),
      percentage: new FormControl(null),
      isEditableA5: new FormControl(true),
      isEditable: new FormControl(true)
    });
  }

  createAdd221performance(): any {
    return this.fb.group({
      id: new FormControl(null),
      overAmount: new FormControl(null, Validators.required),
      perAmount: new FormControl(null, Validators.required),
      percentage: new FormControl(65, Validators.compose([Validators.required, Validators.min(50), Validators.max(80)])),
      taxPerAmount: new FormControl(null, Validators.required),
      year: new FormControl(null, Validators.required),
      isEditable: new FormControl(true)
    });
  }

  changeFormControlValue(field: any, formControlValue: any, event: MatCheckboxChange, i: number): any {
    if (field) {
      const splitted = field.sfunction.split(' ');

      if (event.checked) {
        this.formGroup.controls[field.keli].setValue(1);
        this.formGroup.controls[splitted[2]].setValue('');
        this.formGroup.controls[splitted[2]].setValidators(Validators.required);
        this.formGroup.controls[splitted[2]].updateValueAndValidity();
      } else {
        this.formGroup.controls[field.keli].setValue(0);
        this.formGroup.controls[splitted[2]].setValue(null);
        this.formGroup.controls[splitted[2]].clearValidators();
        this.formGroup.controls[splitted[2]].updateValueAndValidity();
      }
    }
  }

  doneOverallRowA5Field(overallFormGroup: any): any {
    const oldInterimBaseAmount = overallFormGroup.get('interimBaseAmount').value;
    const interimBaseAmount = Number(oldInterimBaseAmount.replaceAll('.', '').replace(',', '.'));
    const minLimit = Number(overallFormGroup.get('minLimit').value.replaceAll('.', '').replace(',', '.'));
    const maxLimit = Number(overallFormGroup.get('maxLimit').value.replaceAll('.', '').replace(',', '.'));

    overallFormGroup.controls.interimBaseAmount.patchValue(interimBaseAmount);
    overallFormGroup.controls.minLimit.patchValue(minLimit);
    overallFormGroup.controls.maxLimit.patchValue(maxLimit);
    overallFormGroup.controls.overAmount.patchValue(Number(overallFormGroup.get('overAmount').value));
    overallFormGroup.get('isEditable').setValue(false);
    overallFormGroup.get('isEditableA5').setValue(false);

    let sentOverallDto: any;
    sentOverallDto = overallFormGroup.value;
    sentOverallDto.baseId = overallFormGroup.get('base').value.id;
    sentOverallDto.percentage = null;
    this.essentialSizeControllerService.saveEssentialSizeOverall(this.projectId, this.formList.id, sentOverallDto).subscribe(res => {
      this.getData(this.projectId);
    });
  }

  /** METHOD IN ORDER TO CHANGE A5 FIELD (SELECTION OF OVERALL MATERIALITY AMOUNT BY USER) */
  editOverallRowA5Field(overallFormGroup: any): any {
    if (overallFormGroup !== null) {
      overallFormGroup.get('isEditableA5').setValue(true);
      overallFormGroup.get('isEditable').setValue(true);
      let minLimit: any;
      let maxLimit: any;
      let overAmount: any;
      if (overallFormGroup.get('minLimit').value !== null) {
        const oldA3 = overallFormGroup.get('minLimit').value;
        minLimit = Number(oldA3.replaceAll('.', '').replace(',', '.'));
      }
      if (overallFormGroup.get('maxLimit').value !== null) {
        const oldA4 = overallFormGroup.get('maxLimit').value;
        maxLimit = Number(oldA4.replaceAll('.', '').replace(',', '.'));
      }
      if (overallFormGroup.get('overAmount').value !== null){
        const oldA5 = overallFormGroup.get('overAmount').value;
        overAmount = Number(oldA5.replaceAll('.', '').replace(',', '.'));
      }
      overallFormGroup.controls.overAmount.patchValue(overAmount);
      overallFormGroup.controls.overAmount.setValidators(Validators.compose([Validators.min(minLimit), Validators.max(maxLimit)]));
      overallFormGroup.updateValueAndValidity();
    }
  }

  donePerformancePercentage(performanceFormGroup: any): any {
    let overAmount: any;
    if (performanceFormGroup.get('overAmount').value !== null) {
      const oldOverAmount = performanceFormGroup.get('overAmount').value;
      overAmount = Number(oldOverAmount.replaceAll('.', '').replace(',', '.'));
    }
    const percentage = Number(performanceFormGroup.get('percentage').value);
    const perAmount = Number(performanceFormGroup.get('perAmount').value);
    const taxPerAmount = Number(performanceFormGroup.get('taxPerAmount').value);
    performanceFormGroup.controls.overAmount.patchValue(overAmount);
    performanceFormGroup.controls.percentage.patchValue(percentage);
    performanceFormGroup.controls.perAmount.patchValue(perAmount);
    performanceFormGroup.controls.taxPerAmount.patchValue(taxPerAmount);
    performanceFormGroup.get('isEditable').setValue(false);
    this.essentialSizeControllerService.saveEssentialSizePerformance(this.projectId, this.formList.id, performanceFormGroup.value)
      .subscribe(res => {
        this.getData(this.projectId);
      });
  }

  editPerformanceRow(performanceFormGroup: any): any {
    if (performanceFormGroup.controls.percentage.value !== null) {
      const oldPercentage = performanceFormGroup.get('percentage').value;
      let percentage = 0;
      if (this.isString(oldPercentage)) {
        percentage = Number(oldPercentage.replace(',', '.'));
      } else {
        percentage = performanceFormGroup.get('percentage').value;
      }
      performanceFormGroup.controls.percentage.patchValue(percentage);
    }
    performanceFormGroup.get('isEditable').setValue(true);
  }

  return(group: any): any {
    this.add221performanceLoaded = false;
    if (group !== null) {
      group.get('isEditable').setValue(false);
      this.getData(this.projectId);
    }
  }

  returnPerformanceGroup(group: any): any {
    this.add221performanceLoaded = false;
    if (group !== null) {
      group.get('isEditable').setValue(false);
      this.getData(this.projectId);
    }
  }

  isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
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

  setMaterialityBase(materialityBaseId: number): any {
    if (this.formGroup.value !== null) {
      const sentEssentialSizeDto: any = Object.create(null);
      this.formGroup.controls.status.setValue('SAVED');
      let overAmount: any;
      let taxOverAmount: any;
      if (this?.formGroup?.get('overAmount')?.value !== null){
        const oldA5 = this?.formGroup?.get('overAmount')?.value;
        overAmount = Number(oldA5.replaceAll('.', '').replace(',', '.'));
      }
      if (this?.formGroup?.get('taxOverAmount')?.value !== null){
        const oldA5 = this?.formGroup?.get('taxOverAmount')?.value;
        taxOverAmount = Number(oldA5.replaceAll('.', '').replace(',', '.'));
      }
      sentEssentialSizeDto.id = this.formGroup.controls.id.value;
      sentEssentialSizeDto.status = this.formGroup.controls.status.value;
      sentEssentialSizeDto.baseId = materialityBaseId;
      sentEssentialSizeDto.documentationBase = this.formGroup.controls.documentationBase.value;
      sentEssentialSizeDto.overAmount = overAmount;
      sentEssentialSizeDto.taxOverAmount = taxOverAmount;
      sentEssentialSizeDto.essentialSizeOverallDtoList = [];
      sentEssentialSizeDto.essentialSizePerformanceDtoList = [];
      console.log(sentEssentialSizeDto);

      if (this.formList.id != null) {
        this.essentialSizeControllerService.saveEssentialSize(this.projectId, this.formList.id, sentEssentialSizeDto)
          .subscribe((res: any) => {
            this.getData(this.projectId);
          });
      }
    }
  }
}
