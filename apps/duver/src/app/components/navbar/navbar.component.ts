import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'website-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {

  constructor(public authService:AuthService,
    private router:Router
  ){}


  onLogoutClick(){
    this.authService.logout();
    
    this.router.navigate(['/login']);
    return false;
  }
}
