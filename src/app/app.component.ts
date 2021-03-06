import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private auth:AuthService, private router:Router){
    
    auth.user$.subscribe(user=>{
      // if(!user) return;
        
      // let returnUrl = localStorage.getItem('returnUrl');
      // if(!returnUrl) return;
      
      // localStorage.removeItem('returnUrl');
      // router.navigateByUrl(returnUrl);
      if(user){
        let returnUrl = localStorage.getItem('returnUrl');
        router.navigateByUrl(returnUrl);
      }
    });
  }
}
