import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CustomValidators} from "ngx-custom-validators";
import {LoginService} from "../../shared/Injectables/services/login.service";
import {FormViewModel} from "../../shared/models/general-form-view-models/form-view.model";
import {FormService} from "../../shared/Injectables/services/form.service";


const password = new FormControl('', Validators.required);
const username = new FormControl('', Validators.required);
const firstName = new FormControl('', Validators.required);
const lastName = new FormControl('', Validators.required);
// @ts-ignore
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  tableName = 'REGISTER';

  currentLang: any;

  public form: FormGroup = Object.create(null);

  loadingFields = false;

  formTitle = new FormViewModel();
  firstNamePlaceHolder = new FormViewModel();
  firstNameRequired = new FormViewModel();
  lastNamePlaceHolder = new FormViewModel();
  lastNameRequired = new FormViewModel();
  usernamePlaceHolder = new FormViewModel();
  usernameRequired = new FormViewModel();
  emailPlaceHolder = new FormViewModel();
  emailRequired = new FormViewModel();
  validEmailRequired = new FormViewModel();
  passwordPlaceHolder = new FormViewModel();
  passwordRequired = new FormViewModel();
  confirmPasswordPlaceHolder = new FormViewModel();
  confirmPasswordRequired = new FormViewModel();
  validConfirmPasswordRequired = new FormViewModel();
  registerButton = new FormViewModel();
  loginText = new FormViewModel();
  loginButton = new FormViewModel();

  constructor(private fb: FormBuilder,
              private formService: FormService,
              private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
    this.currentLang =  this.router.url.split('/')[1];
    this.form = this.fb.group({
      // @ts-ignore
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      username: username,
      firstName: firstName,
      lastName: lastName,
      password: password,
      confirmPassword: confirmPassword
    });
    this.getFormFields();
  }

  onSubmit() {
    this.loginService.register(this.form.value).subscribe( res => {
      if (res === null){
            this.router.navigate(['el/login']);
      }
    });
  }

  getFormFields(): any {
    this.formService.getFormViewModel(this.tableName, this.currentLang, 'T').subscribe(res => {
      this.loadingFields = true;
      this.declarationOfFields(res);
    });
  }

  declarationOfFields(formList: FormViewModel[]): any {
    formList.forEach(row => {
      if (row.typos === 'TITLE') {
        this.formTitle = row;
      }
      if (row.typos === 'USERNAME PLACEHOLDER') {
        this.usernamePlaceHolder = row;
      }
      if (row.typos === 'USERNAME REQUIRED') {
        this.usernameRequired = row;
      }
      if (row.typos === 'PASSWORD PLACEHOLDER') {
        this.passwordPlaceHolder = row;
      }
      if (row.typos === 'PASSWORD REQUIRED') {
        this.passwordRequired = row;
      }
      if (row.typos === 'FIRST NAME PLACEHOLDER') {
        this.firstNamePlaceHolder = row;
      }
      if (row.typos === 'FIRST NAME REQUIRED') {
        this.firstNameRequired = row;
      }
      if (row.typos === 'LAST NAME PLACEHOLDER') {
        this.lastNamePlaceHolder = row;
      }
      if (row.typos === 'LAST NAME REQUIRED') {
        this.lastNameRequired = row;
      }
      if (row.typos === 'EMAIL PLACEHOLDER') {
        this.emailPlaceHolder = row;
      }
      if (row.typos === 'EMAIL REQUIRED') {
        this.emailRequired = row;
      }
      if (row.typos === 'VALID EMAIL REQUIRED') {
        this.validEmailRequired = row;
      }
      if (row.typos === 'CONFIRM PASSWORD PLACEHOLDER') {
        this.confirmPasswordPlaceHolder = row;
      }
      if (row.typos === 'CONFIRM PASSWORD REQUIRED') {
        this.confirmPasswordRequired = row;
      }
      if (row.typos === 'VALID CONFIRM PASSWORD REQUIRED') {
        this.validConfirmPasswordRequired = row;
      }
      if (row.typos === 'REGISTER BUTTON') {
        this.registerButton = row;
      }
      if (row.typos === 'LOGIN TEXT') {
        this.loginText = row;
      }
      if (row.typos === 'LOGIN BUTTON') {
        this.loginButton = row;
      }
    });
  }

}
