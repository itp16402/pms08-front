import {Component, HostListener, Inject, OnInit, Optional} from '@angular/core';
import {FormViewModel} from '../../models/general-form-view-models/form-view.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormService} from '../../Injectables/services/form.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  formFields: FormViewModel[] = [];
  title: any;
  paragraph: any;
  yesButton: any;
  noButton: any;
  lang: any;
  currentLang: any;
  loading = true;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<DeleteModalComponent>,
              private router: Router,
              private formService: FormService) {
    dialogRef.disableClose = true;
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    this.currentLang =  this.router.url.split('/')[1];
    this.formService.getFormViewModel('DELETE TABLE', this.currentLang, 'T').subscribe(res => {
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
      if (row.typos === 'PARAGRAPH') {
        this.paragraph = row.onoma;
      }
      if (row.typos === 'NO BUTTON') {
        this.noButton = row.onoma;
      }
      if (row.typos === 'YES BUTTON') {
        this.yesButton = row.onoma;
      }
    });
  }

  close() {
    this.dialogRef.close('No');
  }

  yes() {
    this.dialogRef.close('Yes');
  }
}
