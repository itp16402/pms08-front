import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormService} from '../../../../../../shared/Injectables/services/form.service';
import {FormRoleControllerService} from '../../../../../../shared/Injectables/services/form-role-controller.service';
import {FormListControllerService} from '../../../../../../shared/Injectables/services/form-list-controller.service';
import {FormViewModel} from '../../../../../../shared/models/general-form-view-models/form-view.model';
import {PhaseDtoModel} from '../../../../../../shared/models/phase/phase-dto.model';
import {StepDtoModel} from '../../../../../../shared/models/phase/step-dto.model';
import {FormDtoModel} from '../../../../../../shared/models/phase/form-dto.model';
import {ParentDtoModel} from '../../../../../../shared/models/phase/parent-dto.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-assign-forms-to-member',
  templateUrl: './assign-forms-to-member.component.html',
  styleUrls: ['./assign-forms-to-member.component.scss']
})
export class AssignFormsToMemberComponent implements OnInit {

  parentAssignFormList: ParentDtoModel[] = [];

  /** parameters in order to set values from local storage */
  currentLang: any;

  /** parameters  */
  loadingFormList = true;

  /** parameters for html display from Postgres SQL */
  formFields: FormViewModel[] = [];
  title: any;
  paragraph: any;
  loading = true;
  yesButton: any;
  noButton: any;

  /** incoming parameters about member and order */
  projectId: any;
  userId: any;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AssignFormsToMemberComponent>,
              private formService: FormService,
              private formListControllerService: FormListControllerService,
              private formRoleControllerService: FormRoleControllerService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.currentLang =  this.router.url.split('/')[1];
    this.projectId = this.data.member.projectId;
    this.userId = this.data.member.userId;
    this.getFormFields();
    this.getAlreadyAssignedFormsToMember(this.userId, this.projectId);
  }

  getFormFields(): void {
    this.formService.getFormViewModel('ASSIGN TABLE', this.currentLang, 'T').subscribe(res => {
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

  getAlreadyAssignedFormsToMember(memberId: number, orderId: number): void {
    this.formRoleControllerService.fetchFlowchartWithExistedMembers(memberId, this.currentLang, orderId).subscribe(res => {
      this.parentAssignFormList = res;
      this.loadingFormList = false;
    });
  }

  close(): void {
    this.dialogRef.close('No');
  }

  yes(): void {
    this.dialogRef.close('Yes');
  }

  isParentSelected(selectedParent: ParentDtoModel): void {
    const formListIdsForAdd = [];
    const formListIdsForDelete = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.parentAssignFormList.length; i++) {
      if (selectedParent.checked === true) {
        if (selectedParent.phase === this.parentAssignFormList[i].phase){
          this.parentAssignFormList[i].checked = true;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.parentAssignFormList[i]?.phases.length; j++) {
            this.parentAssignFormList[i].phases[j].checked = true;
            // tslint:disable-next-line:prefer-for-of
            for (let k = 0; k < this.parentAssignFormList[i]?.phases[j].steps.length; k++) {
              this.parentAssignFormList[i].phases[j].steps[k].checked = true;
              // tslint:disable-next-line:prefer-for-of
              for (let t = 0; t < this.parentAssignFormList[i]?.phases[j].steps[k].forms.length; t++) {
                this.parentAssignFormList[i].phases[j].steps[k].forms[t].checked = true;
                formListIdsForAdd.push(this.parentAssignFormList[i].phases[j].steps[k].forms[t].id);
              }
            }
          }
        }
      } else {
        this.parentAssignFormList[i].checked = false;
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.parentAssignFormList[i].phases.length; j++) {
          this.parentAssignFormList[i].phases[j].checked = false;
          // tslint:disable-next-line:prefer-for-of
          for (let k = 0; k < this.parentAssignFormList[i].phases[j].steps.length; k++) {
            this.parentAssignFormList[i].phases[j].steps[k].checked = false;
            // tslint:disable-next-line:prefer-for-of
            for (let t = 0; t < this.parentAssignFormList[i]?.phases[j].steps[k].forms.length; t++) {
              this.parentAssignFormList[i].phases[j].steps[k].forms[t].checked = true;
              formListIdsForDelete.push(this.parentAssignFormList[i].phases[j].steps[k].forms[t].id);
            }
          }
        }
      }
    }
    if (formListIdsForAdd.length !== 0) {
      this.formRoleControllerService.saveFormRoles(this.userId, this.projectId, formListIdsForAdd).subscribe(addRes => {
        if (addRes == null) {
          this.getAlreadyAssignedFormsToMember(this.userId, this.projectId);
        }
      });
    } else if (formListIdsForDelete.length !== 0) {
      this.formRoleControllerService.removeFormRoles(this.userId, this.projectId, formListIdsForDelete).subscribe(res => {
        if (res == null) {
          this.getAlreadyAssignedFormsToMember(this.userId, this.projectId);
        }
      });
    }

  }


  isPhaseSelected(selectedPhase: PhaseDtoModel): void {
    const formListIdsForAdd = [];
    const formListIdsForDelete = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.parentAssignFormList.length; i++) {
      if (selectedPhase.checked === true) {
        // tslint:disable-next-line:prefer-for-of
        for (let t = 0; t < this.parentAssignFormList[i].phases.length; t++) {
          if (selectedPhase.phase === this.parentAssignFormList[i].phases[t].phase) {
            this.parentAssignFormList[i].phases[t].checked = true;
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < this.parentAssignFormList[i].phases[t].steps.length; j++) {
              this.parentAssignFormList[i].phases[t].steps[j].checked = true;
              // tslint:disable-next-line:prefer-for-of
              for (let k = 0; k < this.parentAssignFormList[i].phases[t].steps[j].forms.length; k++) {
                this.parentAssignFormList[i].phases[t].steps[j].forms[k].checked = true;
                formListIdsForAdd.push(this.parentAssignFormList[i].phases[t].steps[j].forms[k].id);
              }
            }
          }
        }
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let t = 0; t < this.parentAssignFormList[i].phases.length; t++) {
          if (this.parentAssignFormList[i].phases[t].phase === selectedPhase.phase) {
            this.parentAssignFormList[i].phases[t].checked = false;
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < this.parentAssignFormList[i].phases[t].steps.length; j++) {
              this.parentAssignFormList[i].phases[t].steps[j].checked = false;
              // tslint:disable-next-line:prefer-for-of
              for (let k = 0; k < this.parentAssignFormList[i].phases[t].steps[j].forms.length; k++) {
                this.parentAssignFormList[i].phases[t].steps[j].forms[k].checked = false;
                formListIdsForDelete.push(this.parentAssignFormList[i].phases[t].steps[j].forms[k].id);
              }
            }
          }
        }
      }
    }

    if (formListIdsForAdd.length !== 0) {
      this.formRoleControllerService.saveFormRoles(this.userId, this.projectId, formListIdsForAdd).subscribe(addRes => {
        if (addRes == null) {
          this.getAlreadyAssignedFormsToMember(this.userId, this.projectId);
        }
      });
    } else if (formListIdsForDelete.length !== 0) {
      this.formRoleControllerService.removeFormRoles(this.userId, this.projectId, formListIdsForDelete).subscribe(res => {
        if (res == null) {
          this.getAlreadyAssignedFormsToMember(this.userId, this.projectId);
        }
      });
    }

  }

  isStepSelected(step: StepDtoModel, phase: any): void {
    const formListIdsForAdd = [];
    const formListIdsForDelete = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.parentAssignFormList.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let t = 0; t < this.parentAssignFormList[i].phases.length; t++) {
        if (step.checked === true) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.parentAssignFormList[i].phases[t].steps.length; j++) {
            if (step === this.parentAssignFormList[i].phases[t].steps[j]) {
              this.parentAssignFormList[i].phases[t].steps[j].checked = true;
              // tslint:disable-next-line:prefer-for-of
              for (let k = 0; k < this.parentAssignFormList[i].phases[t].steps[j].forms.length; k++) {
                this.parentAssignFormList[i].phases[t].steps[j].forms[k].checked = true;
                formListIdsForAdd.push(this.parentAssignFormList[i].phases[t].steps[j].forms[k].id);
              }
            }
          }
        } else if (step.checked === false) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.parentAssignFormList[i].phases[t].steps.length; j++) {
            if (step === this.parentAssignFormList[i].phases[t].steps[j]) {
              this.parentAssignFormList[i].phases[t].steps[j].checked = true;
              // tslint:disable-next-line:prefer-for-of
              for (let k = 0; k < this.parentAssignFormList[i].phases[t].steps[j].forms.length; k++) {
                this.parentAssignFormList[i].phases[t].steps[j].forms[k].checked = true;
                formListIdsForDelete.push(this.parentAssignFormList[i].phases[t].steps[j].forms[k].id);
              }
            }
          }
        }
      }
    }

    if (formListIdsForAdd.length !== 0) {
      this.formRoleControllerService.saveFormRoles(this.userId, this.projectId, formListIdsForAdd).subscribe(addRes => {
        if (addRes == null) {
          this.getAlreadyAssignedFormsToMember(this.userId, this.projectId);
        }
      });
    } else if (formListIdsForDelete.length !== 0) {
      this.formRoleControllerService.removeFormRoles(this.userId, this.projectId, formListIdsForDelete).subscribe(res => {
        if (res == null) {
          this.getAlreadyAssignedFormsToMember(this.userId, this.projectId);
        }
      });
    }
  }

  isFormSelected(form: FormDtoModel): void {
    const formListIdsForAddAndRemove = [];
    formListIdsForAddAndRemove.push(form.id);
    if (form.checked === true) {
      this.formRoleControllerService.saveFormRoles(this.userId, this.projectId, formListIdsForAddAndRemove).subscribe(res => {
        if (res == null) {
          this.getAlreadyAssignedFormsToMember(this.userId, this.projectId);
        }
      });
    } else if (form.checked === false) {
      this.formRoleControllerService.removeFormRoles(this.userId, this.projectId, formListIdsForAddAndRemove).subscribe(res => {
        if (res == null) {
          this.getAlreadyAssignedFormsToMember(this.userId, this.projectId);
        }
      });
    }

  }
}
