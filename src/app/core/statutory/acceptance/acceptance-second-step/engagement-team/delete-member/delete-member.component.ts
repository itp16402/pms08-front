import {Component, HostListener, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormService} from '../../../../../../shared/Injectables/services/form.service';
import {FormViewModel} from '../../../../../../shared/models/general-form-view-models/form-view.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-delete-member',
  templateUrl: './delete-member.component.html',
  styleUrls: ['./delete-member.component.scss']
})
export class DeleteMemberComponent implements OnInit {

  formFields: FormViewModel[] = [];
  title: any;
  paragraphMember: any;
  paragraphAdmin: any;
  yesButton: any;
  noButton: any;
  currentLang: any;
  loading = true;
  separator: any;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<DeleteMemberComponent>,
              private router: Router,
              private formService: FormService) {
    dialogRef.disableClose = true;
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.separator = this.data.separator;
    this.currentLang =  this.router.url.split('/')[1];
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
      if (row.typos === 'PARAGRAPH MEMBER') {
        this.paragraphMember = row.onoma;
      }
      if (row.typos === 'PARAGRAPH ADMIN') {
        this.paragraphAdmin = row.onoma;
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
