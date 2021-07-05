import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FormViewModel} from '../../../../../shared/models/general-form-view-models/form-view.model';
import {FormListControllerService} from '../../../../../shared/Injectables/services/form-list-controller.service';
import {FormService} from '../../../../../shared/Injectables/services/form.service';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {MemberRoleResponseDtoModel} from '../../../../../shared/models/acceptance/member/member-role-response-dto.model';
import {UserRoleControllerService} from '../../../../../shared/Injectables/services/user-role-controller.service';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {UserControllerService} from '../../../../../shared/Injectables/services/user-controller.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {UserDtoModel} from '../../../../../shared/models/acceptance/member/user-dto.model';
import {MemberRoleRequestDtoModel} from '../../../../../shared/models/acceptance/member/member-role-request-dto.model';
import {DeleteMemberComponent} from './delete-member/delete-member.component';
import {AssignFormsToMemberComponent} from './assign-forms-to-member/assign-forms-to-member.component';
import {EditAcceptanceComponent} from '../../../../../shared/shared-componets/edit-acceptance/edit-acceptance.component';
import {MemberStatusControllerService} from '../../../../../shared/Injectables/services/acceptance/member-status-controller.service';
import {FormStatusRequestDtoModel} from '../../../../../shared/models/form-status-request-dto.model';
import {FormListDtoModel} from '../../../../../shared/models/general-form-view-models/form-list-dto.model';
import {FormRoleControllerService} from '../../../../../shared/Injectables/services/form-role-controller.service';

@Component({
  selector: 'app-engagement-team',
  templateUrl: './engagement-team.component.html',
  styleUrls: ['./engagement-team.component.scss']
})
export class EngagementTeamComponent implements OnInit, AfterViewInit {

  /** boolean parameters for logged in member id role */
  isAdmin = false;
  isPartner = false;
  isOwner = false;
  isMember = false;
  isEqcr = false;

  /** owner is also admin for selected order */
  ownerIsAdmin = false;

  loggedInMemberId: any;
  currentLang: any;
  currentUser: any;
  projectId: any;
  formList: any;
  selectedTable: any;

  /** parameter for setting the status of form */
  formStatus = new FormStatusRequestDtoModel();
  loadFormStatus = false;

  /** form view list in order to bind the display fields from table a121 */
  controlTeamFormViewModel: FormViewModel[] = [];
  /** list in order to pass the values of all members for selected orderId */
  memberRoleResponseModelList: MemberRoleResponseDtoModel[] = [];
  /** parameter in order to send the selected MEMBER from user */
  addMember: MemberRoleRequestDtoModel = Object.create(null);
  /** parameter in order to send the selected EQCR from user */
  addEqcr: MemberRoleRequestDtoModel = Object.create(null);

  /** list in order to push there members according to their roles */
  managerList: MemberRoleResponseDtoModel[] = [];
  partnerList: MemberRoleResponseDtoModel[] = [];
  ownerList: MemberRoleResponseDtoModel[] = [];
  memberList: MemberRoleResponseDtoModel[] = [];
  eqcrList: MemberRoleResponseDtoModel[] = [];
  /** general html parameters in order to display certain tags and buttons */
  formTitle = new FormViewModel();
  videoTitle: any;
  pdfTitle: any;
  searchPlaceHolder: any;
  searchAdminPlaceHolder: any;
  searchEqcrPlaceHolder: any;

  saveButton = new FormViewModel();
  editButton = new FormViewModel();
  completeButton = new FormViewModel();
  returnButton = new FormViewModel();

  /** chips boolean parameters */
  visible = true;
  removable = true;
  /** parameters for auto complete tag at all selections and loading parameter in order to load progress bar on search */
  @ViewChild('auto') matAutocomplete: any;
  filteredMembers: UserDtoModel[] = [];
  isLoading = false;
  /** member input html tag and its control */
  @ViewChild('memberInput') memberInput: any;
  memberCtrl = new FormControl();
  /** admin input html tag and its control */
  @ViewChild('adminInput') adminInput: any;
  adminCtrl = new FormControl();
  /** eqcr input html tag and its control */
  @ViewChild('eqcrInput') eqcrInput: any;
  eqcrCtrl = new FormControl();

  formGroup: FormGroup = Object.create(null);
  initialised = false;

  /** PARAMETERS IN ORDER TO CHECK MEMBER ROLE */
  memberId: any;
  memberCanMakeChangesIntoForm = false;

  noDataMessage: any;

  constructor(private formListControllerService: FormListControllerService,
              private formRoleControllerService: FormRoleControllerService,
              private formsService: FormService,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private cdf: ChangeDetectorRef,
              private userRoleControllerService: UserRoleControllerService,
              private userControllerService: UserControllerService,
              private memberStatusControllerService: MemberStatusControllerService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.loggedInMemberId = localStorage.getItem('memberId');
    this.currentUser = localStorage.getItem('currentUser');
    this.currentLang =  this.router.url.split('/')[1];
    this.projectId = Number(this.router.url.split('/')[3]);
    this.memberId = localStorage.getItem('memberId');
    this.selectedTable = this.activatedRoute.snapshot.params.tableName;
    this.createForm();
    this.getButtons();
    this.getFormFields();
    this.getFormListId(this.selectedTable);
    this.getMembers(this.projectId);
    this.memberCtrlChange();
    this.adminCtrlChange();
    this.eqcrCtrlChange();
  }

  ngAfterViewInit(): void {
    this.cdf.detectChanges();
  }

  adminCtrlChange(): void {
    this.adminCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.filteredMembers = [];
        this.isLoading = true;
      }),
      switchMap(value => this.userControllerService.searchMemberByLastName(this.adminCtrl.value,
        this.currentUser).
      pipe(
        finalize( () => {
          this.isLoading = false;
        })
      ))
    ).subscribe( (data: UserDtoModel[]) => {
      if (data === undefined) {
        this.filteredMembers = [];
      } else {
        this.filteredMembers = data;
      }

    });
  }

  memberCtrlChange(): void {
    this.memberCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.filteredMembers = [];
        this.isLoading = true;
      }),
      switchMap(value => this.userControllerService.searchMemberByLastName(this.memberCtrl.value,
        this.currentUser).
      pipe(
        finalize( () => {
          this.isLoading = false;
        })
      ))
    ).subscribe( (data: UserDtoModel[]) => {
      if (data === undefined) {
        this.filteredMembers = [];
      } else {
        this.filteredMembers = data;
      }

    });
  }

  eqcrCtrlChange(): void {
    this.eqcrCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.filteredMembers = [];
        this.isLoading = true;
      }),
      switchMap(value => this.userControllerService.searchMemberByLastName(this.eqcrCtrl.value,
        this.currentUser).
      pipe(
        finalize( () => {
          this.isLoading = false;
        })
      ))
    ).subscribe( (data: UserDtoModel[]) => {
      if (data === undefined) {
        this.filteredMembers = [];
      } else {
        this.filteredMembers = data;
      }

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

  getFormFields(): void {
    this.formsService.findFormsByTableNameAndOrderId(this.selectedTable, this.currentLang, this.projectId).subscribe(res => {
      this.controlTeamFormViewModel = res;
      this.declarationOfTitles(this.controlTeamFormViewModel);
    });
  }

  declarationOfTitles(controlTeamFormViewModel: FormViewModel[]): void {
    controlTeamFormViewModel.forEach(row => {
      if (row.typos === 'TITLE') {
        this.formTitle = row;
      }
      if (row.typos === 'PDF HELP') {
        this.pdfTitle = row.onoma;
      }
      if (row.typos === 'VIDEO HELP') {
        this.videoTitle = row.onoma;
      }
      if (row.typos === 'SEARCH PLACE HOLDER') {
        this.searchPlaceHolder = row.onoma;
      }
      if (row.typos === 'SEARCH ADMIN PLACE HOLDER') {
        this.searchAdminPlaceHolder = row.onoma;
      }
      if (row.typos === 'SEARCH EQCR PLACE HOLDER') {
        this.searchEqcrPlaceHolder = row.onoma;
      }
    });
  }

  getFormListId(formName: string): void {
    this.formListControllerService.getFormByName(formName).subscribe(res => {
      this.formList = res;
      this.checkMemberRole(this.memberId, this.projectId, this.formList);
      this.getFormStatus(res);
    });
  }

  checkMemberRole(memberId: any, orderId: any, selectedForm: FormListDtoModel): any{
    if (selectedForm !== null) {
      this.formRoleControllerService.checkIfMemberIsAssignedInForm(memberId, orderId, selectedForm.id).subscribe(res => {
        this.memberCanMakeChangesIntoForm = res;
      });
    }
  }

  getFormStatus(res: any): any {
    // tslint:disable-next-line:no-shadowed-variable
    this.memberStatusControllerService.getStatus(this.projectId, res.id).subscribe(res => {
      this.formStatus = res;
      if (this.formStatus !== null) {
        this.formGroup.patchValue(this.formStatus);
      }
      this.loadFormStatus = true;
    });
  }

  createForm(): void {
    this.formGroup = this.fb.group({
      status: new FormControl(null)
    });
  }

  back(): void {
    this.router.navigate([this.currentLang, 'home', this.projectId, 'statutory', 'acceptance', 'acceptance-second-step']);
  }

  save(): void {
    this.formGroup.controls.status.setValue('SAVED');
    this.memberStatusControllerService.saveStatus(this.projectId, this.formList.id, this.formGroup.value).subscribe(res => {
      this.getMembers(this.projectId);
      this.getFormStatus(this.formList);
    });
  }

  complete(): void {
    this.formGroup.controls.status.setValue('COMPLETED');
    this.memberStatusControllerService.saveStatus(this.projectId, this.formList.id, this.formGroup.value).subscribe(res => {
      this.getMembers(this.projectId);
      this.getFormStatus(this.formList);
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
        this.memberStatusControllerService.saveStatus(this.projectId, this.formList.id, this.formGroup.value).subscribe(res => {
          this.getMembers(this.projectId);
          this.getFormStatus(this.formList);
        });
      }
    });
  }

  getMembers(orderId: number): void {
    this.userRoleControllerService.fetchMemberRolesByProjectId(orderId).subscribe(res => {
      this.memberRoleResponseModelList = res;
      this.separationOfMembersIntoTheirList(this.memberRoleResponseModelList);
    });
  }

  separationOfMembersIntoTheirList(memberRoleResponseModelList: any): void {
    this.ownerList = [];
    this.managerList = [];
    this.memberList = [];
    this.eqcrList = [];
    this.partnerList = [];
    memberRoleResponseModelList.forEach( (row: any) => {
      row?.roles?.forEach( (rolesRow: any) => {
        if (rolesRow.id === 1) {
          this.ownerList.push(row);
          this.checkIfLoggedInMemberIdExistIntoOwnerList();
        } else if (rolesRow.id === 2) {
          this.managerList.push(row);
          this.checkIfLoggedInMemberIdExistIntoAdminList();
        } else if (rolesRow.id === 3) {
          this.memberList.push(row);
          this.checkIfLoggedInMemberIdExistIntoMemberList();
        } else if (rolesRow.id === 4) {
          this.eqcrList.push(row);
          this.checkIfLoggedInMemberIdExistIntoEqcrList();
        } else if (rolesRow.id === 5) {
          this.partnerList.push(row);
          this.checkIfLoggedInMemberIdExistIntoPartnerList();
        }
      });
    });
    if ((this.ownerList.length >= 0) && (this.managerList.length >= 0) && (this.memberList.length >= 0)
      && (this.eqcrList.length >= 0) && (this.partnerList.length >= 0)) {
     this.initialised = true;
    }
    this.checkIfOwnerIsAlsoAdminForSelectedOrderId(this.projectId, this.ownerList, this.managerList);
  }

  assignFormsToMember(role: string, member: any): void {
    const dialogRef = this.dialog.open(AssignFormsToMemberComponent, {
      width: 'fit-content',
      height: 'fit-content',
      data: {
        member,
        orderId: this.projectId
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      // do nothing
    });
  }

  deleteMember(role: string, member: any): void {
    const dialogRef = this.dialog.open(DeleteMemberComponent, {
      width: 'fit-content',
      height: 'fit-content',
      data: {
        separator: 'MEMBER'
      }
    });

    dialogRef.afterClosed().subscribe(deleteMember => {
      if (deleteMember === 'Yes') {
        this.userRoleControllerService.removeMember(member.userId, this.projectId).subscribe(response => {
          if (response === null) {
            this.getMembers(this.projectId);
          }
        });
      }
    });
  }

  deleteAdmin(admin: any): void {
    const dialogRef = this.dialog.open(DeleteMemberComponent, {
      width: 'fit-content',
      height: 'fit-content',
      data: {
        separator: 'ADMIN'
      }
    });

    dialogRef.afterClosed().subscribe(deleteMember => {
      if (deleteMember === 'Yes') {
        // tslint:disable-next-line:radix
        if (admin.memberId === parseInt(this.loggedInMemberId)) {
          this.managerList.pop();
        } else {
          this.userRoleControllerService.removeAdmin(admin.memberId, this.projectId).subscribe(res => {
            if (res === null) {
              this.managerList = [];
              this.checkMemberRole(this.memberId, this.projectId, this.formList);
              this.getMembers(this.projectId);
            }
          });
        }
      }
    });
  }

  selectedAdmin(event: MatAutocompleteSelectedEvent): void {
    this.userRoleControllerService.assignAdmin(event.option.value.id, this.projectId, []).subscribe(res => {
      if (res === null) {
        this.managerList = [];
        this.getMembers(this.projectId);
      }
    });
    this.adminInput.nativeElement.value = '';
    this.adminCtrl.setValue(null);
  }

  selectedMember(event: MatAutocompleteSelectedEvent): void {
    const addMemberList = [];
    this.addMember.userId = event.option.value.id;
    this.addMember.roleId = 3;
    addMemberList.push(this.addMember);

    this.userRoleControllerService.addMembers(this.projectId, addMemberList).subscribe(response => {
      if (response === null) {
        this.memberList = [];
        this.getMembers(this.projectId);
      }
    });

    this.memberInput.nativeElement.value = '';
    this.memberCtrl.setValue(null);
  }

  selectedEqcr(event: MatAutocompleteSelectedEvent): void {
    const addEqcrList = [];
    this.addEqcr.userId = event.option.value.id;
    this.addEqcr.roleId = 4;
    addEqcrList.push(this.addEqcr);

    this.userRoleControllerService.addMembers(this.projectId, addEqcrList).subscribe(response => {
      if (response === null) {
        this.memberList = [];
        this.getMembers(this.projectId);
      }
    });

    this.eqcrInput.nativeElement.value = '';
    this.eqcrCtrl.setValue(null);
  }

  checkIfOwnerIsAlsoAdminForSelectedOrderId(orderId: any, ownerList: MemberRoleResponseDtoModel[],
                                            managerList: MemberRoleResponseDtoModel[]): void {
    // tslint:disable-next-line:radix
    this.ownerIsAdmin = ownerList[0].userId === managerList[0].userId || ownerList[0].userId === parseInt(this.loggedInMemberId);
  }

  checkIfLoggedInMemberIdExistIntoPartnerList(): void {
    // tslint:disable-next-line:radix
    this.isPartner = this.partnerList[0].userId === parseInt(this.loggedInMemberId);
  }

  checkIfLoggedInMemberIdExistIntoAdminList(): void {
    // tslint:disable-next-line:radix
    this.isAdmin = this.managerList[0].userId === parseInt(this.loggedInMemberId);
  }

  checkIfLoggedInMemberIdExistIntoOwnerList(): void {
    // tslint:disable-next-line:radix
    this.isOwner = this.ownerList[0].userId === parseInt(this.loggedInMemberId);
  }

  checkIfLoggedInMemberIdExistIntoMemberList(): void {
    this.memberList.forEach( member => {
      // tslint:disable-next-line:radix
      if (member.userId === parseInt(this.loggedInMemberId)) {
        this.isMember = true;
      }
    });
  }

  checkIfLoggedInMemberIdExistIntoEqcrList(): void {
    this.eqcrList.forEach( eqcr => {
      // tslint:disable-next-line:radix
      if (eqcr.userId === parseInt(this.loggedInMemberId)) {
        this.isEqcr = true;
      }
    });
  }
}
