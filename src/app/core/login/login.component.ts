import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LoginService} from '../../shared/Injectables/services/login.service';
import {JwtResponseModel} from '../../shared/models/jwt-response.model';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormViewModel} from "../../shared/models/general-form-view-models/form-view.model";
import {FormService} from "../../shared/Injectables/services/form.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  msg = '';
  loading = false;
  currentLang: any = 'el';

  tableName = 'LOGIN';

  loadingFields = false;

  formTitle = new FormViewModel();
  usernamePlaceHolder = new FormViewModel();
  usernameRequired = new FormViewModel();
  passwordPlaceHolder = new FormViewModel();
  passwordRequired = new FormViewModel();
  loginButton = new FormViewModel();
  registerText = new FormViewModel();
  registerButton = new FormViewModel();

  public form: FormGroup = Object.create(null);

  constructor(private loginService: LoginService,
              private formService: FormService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
    this.currentLang =  this.router.url.split('/')[1];
    this.getFormFields();
  }

  onSubmit(username: string, password: string): void {
    if (username !== null && password !== null){
    this.loginService.login(username, password)
      .pipe()
      .subscribe( (res: JwtResponseModel) => {
        this.loading = true;
        this.router.navigate([this.currentLang, 'projects']);
        this.msg = ''; // in order to clear message box
      },
        (error: any) => {
        this.msg = error.error.message;
        });
    }
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
      if (row.typos === 'LOGIN BUTTON') {
        this.loginButton = row;
      }
      if (row.typos === 'REGISTER TEXT') {
        this.registerText = row;
      }
      if (row.typos === 'REGISTER BUTTON') {
        this.registerButton = row;
      }
    });
  }

}
