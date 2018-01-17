import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  user$: Observable<firebase.User>;  
  
  constructor(private afAuth: AngularFireAuth, private route:ActivatedRoute) { 
    this.user$ = afAuth.authState;
  }
  
  login(email: string, password: string){
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl',returnUrl);

    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(function(){
        console.log('Logged in');
      })
      .catch(function(error){
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
      });
  }

  logout(){
    this.afAuth.auth.signOut();
  }

}
