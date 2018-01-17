import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user:any = {};

  constructor(public auth: AuthService) {
  }

  login(){
    this.auth.login(this.user.email, this.user.password);
  }
}
