import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from './login/login';
import { Signup } from './signup/signup';



@NgModule({
  declarations: [
    Login,
    Signup
  ],
  imports: [
    CommonModule
  ]
})
export class AuthModule { }
