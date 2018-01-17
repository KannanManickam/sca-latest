import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAdmin: boolean;

  constructor(private auth:AuthService, private router: Router) { 
    auth.user$.subscribe(user=>{
      if(user){
        this.isAdmin = user.email.indexOf('admin') >= 0 ? true: false;
      }
    });
  }

  ngOnInit() {
  }

  logout(){
    this.isAdmin = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
