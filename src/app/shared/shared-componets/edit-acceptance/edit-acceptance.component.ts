import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormService} from '../../Injectables/services/form.service';
import {FormViewModel} from '../../models/general-form-view-models/form-view.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-acceptance',
  templateUrl: './edit-acceptance.component.html',
  styleUrls: ['./edit-acceptance.component.scss']
})
export class EditAcceptanceComponent implements OnInit {

  formFields: FormViewModel[] = [];
  title: any;
  paragraph: any;
  yesButton: any;
  noButton: any;
  lang: any;
  currentLang: any;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<EditAcceptanceComponent>,
              private router: Router,
              private formService: FormService) {
  }

  ngOnInit(): void {

    this.currentLang =  this.router.url.split('/')[1];

    this.formService.getFormViewModel('EDIT TABLE', this.currentLang, 'T').subscribe(res => {
      this.formFields = res;
      this.declarationOfTitles(this.formFields);
    });


  }

  declarationOfTitles(formFields: FormViewModel[]): void {
    formFields.forEach(row => {
      if (row.typos === 'TITLE') {
        this.title = row.onoma;
      }
      if (row.typos === 'PARAGRAPH') {
        this.paragraph = row.onoma;
      }
      if (row.typos === '1') {
        this.noButton = row.onoma;
      }
      if (row.typos === '0') {
        this.yesButton = row.onoma;
      }

    });
  }

  close(): any {
    this.dialogRef.close();
  }

  yes(): any {
    this.dialogRef.close('Yes');
  }
}
