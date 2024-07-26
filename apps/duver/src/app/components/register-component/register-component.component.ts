import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'website-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css'],
})
export class RegisterComponentComponent {
  name!: String;
  email! : String 
  username! : string 
  password! : String

  constructor(private ValidateService:ValidateService,
    private authService:AuthService,
    private router : Router
    
  ){}

  submit( register: NgForm ){
    const user = {
    name: register.value.name,
    username : register.value.username,
    password : register.value.password,
    email : register.value.email,
    }
    
    if(!this.ValidateService.validateRegister(user)){
      alert('please fill in all fields');
      return false;
    }
    if(!this.ValidateService.validateEmail(user.email)){
      alert('Please use a valid Email');
      return false;
    }
    this.authService.registerUser(user).subscribe((response:any) => {
      console.log('response',response)
      if (response && response.success) {
        alert('Registration successful');
        // Handle success case: redirect, show message, etc.
        this.router.navigate(['/login'])
      } 
      else {
        console.log('Registration failed:', response);
        alert('Registration failed');
        // Handle failure case: show error message, reset form, etc.
        this.router.navigate(['/register'])
      }
    })

    return true; 
  }
  }