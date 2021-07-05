import {Component, HostListener, Inject, OnInit, Optional} from '@angular/core';
import {FormViewModel} from '../../../shared/models/general-form-view-models/form-view.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {FormService} from '../../../shared/Injectables/services/form.service';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {

  formFields: FormViewModel[] = [];
  title: any;
  paragraph: any;
  yesButton: any;
  noButton: any;
  currentLang: any;
  loading = true;
  email: any;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<RegisterDialogComponent>,
              private router: Router,
              private formService: FormService) {
    dialogRef.disableClose = true;
  }

  @HostListener('window:keyup.esc') onKeyUp(): any {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.email = this.data.email;
    this.currentLang = this.router.url.split('/')[1];
    this.formService.getFormViewModel('DELETE MEMBER', this.currentLang, 'T').subscribe(res => {
      this.formFields = res;
      this.declarationOfTitles(this.formFields);
      this.loading = false;
    });

  }

  declarationOfTitles(formFields: FormViewModel[]): void {
    formFields.forEach(row => {
      if (row.typos === 'TITLE') {
        this.title = row.onoma;
      }
      if (row.typos === 'NO BUTTON') {
        this.noButton = row.onoma;
      }
      if (row.typos === 'YES BUTTON') {
        this.yesButton = row.onoma;
      }
    });
  }

  close(): any {
    this.dialogRef.close('No');
  }

  yes(): any {
    this.dialogRef.close('Yes');
  }
}
