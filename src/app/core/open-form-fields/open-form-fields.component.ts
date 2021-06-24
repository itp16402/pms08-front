import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormViewModel} from "../../shared/models/general-form-view-models/form-view.model";
import {Router} from "@angular/router";
import {FormService} from "../../shared/Injectables/services/form.service";
import {AdminControllerService} from "../../shared/Injectables/services/admin-controller.service";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-open-form-fields',
  templateUrl: './open-form-fields.component.html',
  styleUrls: ['./open-form-fields.component.scss']
})
export class OpenFormFieldsComponent implements OnInit {

  currentLang = '';
  projectId = 0;

  formFields: FormViewModel[] = [];
  tableName = 'FORM FIELDS';

  formTitle = new FormViewModel();
  yesButton = new FormViewModel();
  noButton = new FormViewModel();
  tableHeaders: FormViewModel[] = [];

  incomingTableName = '';

  formGroup: FormGroup = Object.create(null);
  editableFormViewFieldList: FormViewModel[] = [];
  loadFormView = false;

  constructor(private router: Router,
              private formService: FormService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<OpenFormFieldsComponent>,
              private adminControllerService: AdminControllerService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.currentLang = this.router.url.split('/')[1];
    this.projectId = Number(this.router.url.split('/')[3]);
    this.incomingTableName = this.data.tableName;
    this.getFormFields();
    this.getData();
  }

  getFormFields(): void {
    this.formService.getFormViewModel(this.tableName, this.currentLang, 'T').subscribe(res => {
      this.formFields = res;
      this.declarationOfTitles(this.formFields);
    });
  }

  declarationOfTitles(formFields: FormViewModel[]): void {
    formFields.forEach(row => {
      if (row.typos === 'TITLE') {
        this.formTitle = row;
      }
      if (row.typos === 'TABLE HEADERS') {
        this.tableHeaders.push(row);
      }
      if (row.typos === 'NO BUTTON') {
        this.noButton = row;
      }
      if (row.typos === 'YES BUTTON') {
        this.yesButton = row;
      }
    });
  }

  getData(): any {
    this.adminControllerService.findFormNames(this.incomingTableName, this.currentLang).subscribe(res => {
      this.editableFormViewFieldList = res;
      this.initialize();
    });
  }

  createFormField(): any {
    return this.fb.group({
      cell: new FormControl(null),
      comments: new FormControl(null),
      css: new FormControl(null),
      formType: new FormControl(null),
      help: new FormControl(null),
      id: new FormControl(null),
      infos: new FormControl(null),
      keli: new FormControl(null),
      language: new FormControl(null),
      onoma: new FormControl(null),
      optional: new FormControl(null),
      sfunction: new FormControl(null),
      sorder: new FormControl(null),
      sprint: new FormControl(null),
      svalues: new FormControl(null),
      tableName: new FormControl(null),
      typos: new FormControl(null),
      upload: new FormControl(null),
      value: new FormControl(null),
      isEditable: new FormControl(false)
    });
  }



  initialize(): any {
    this.formGroup = this.fb.group({
      rows: this.fb.array([])
    });

    if (this.editableFormViewFieldList.length !== 0) {
      this.editableFormViewFieldList.forEach(row => {
        const rowObject = this.createFormField();
        rowObject.patchValue(row);
        (this.formGroup.controls.rows as FormArray).push(rowObject);
      });
    }
    this.loadFormView = true;
  }

  close(): void {
    this.dialogRef.close({event:'No'});
  }

  yes(): void {
    this.dialogRef.close({event:'Yes'});
  }

  saveField(field: any): any {
    this.adminControllerService.saveFormNames(field.value).subscribe(res => {
      console.log(res);
      this.getData();
    });
  }

  returnField(): any {
    this.getData();
  }

  editField(field: any): any {
    field.get('isEditable').setValue(true);
  }
}
