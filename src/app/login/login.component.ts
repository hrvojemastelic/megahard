import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(private dataService: UserService,private router: Router) {}

  ngOnInit() {
  }

  // Example login function
  login() {

    
    this.dataService.loginUser(this.username,this.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        // Handle the successful login response
        this.router.navigate(['/tabs-interface']);
      },
      (error) => {
        console.error('Login failed:', error);
        // Handle login error
      }
    );
  }
}
