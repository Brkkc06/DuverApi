import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'website-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
})
export class LoginComponentComponent {
  username!:String;
  password! :String

  constructor(private authService:AuthService,private router:Router){}

  onLoginSubmit( login: NgForm){
    const user = {
      username: login.value.username,
      password : login.value.password
    }
    this.authService.authenticateUser(user).subscribe({next:data => {
      if(data.success){
        this.authService.storeUserData(data.token, data.user)
       alert('succesful log in');
       this.router.navigate(['statistics']);
      }
      else{
        alert(data.msg);
        this.router.navigate(['login']);
      }
    }});

  }
}
