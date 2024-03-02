import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

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
  user:User | undefined ;
  constructor(private authService: AuthService,private router: Router) {

    
  }

  ngOnInit() {

  }

  // Example login function
  login() {

    
    this.authService.loginUser(this.username.trim(),this.password.trim()).subscribe(
      (response) => {
        this.user = response["user"] as User;
        console.log('Login successful:', response);
        console.log('Login successful:', this.user);
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
