import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'website-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.css'],
})
export class ProfileComponentComponent implements OnInit { 
  user:any
  constructor(private authService:AuthService,private router:Router){}
  ngOnInit() {
    this.authService.getProfile().subscribe(profile=> {
      this.user = profile.user
    })
  }
  
}
