import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-forgot-password',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
    router = inject(Router);
    authService = inject(AuthService);

    form: FormGroup = new FormGroup({
        username: new FormControl(null, Validators.required),
    });

    resetPassword() {
        if (this.form.valid) {
            const username = this.form.value.username;
            this.authService.resetPassword(username).subscribe();
        }
    }

    openLoginPage() {
        this.router.navigate(['login']);
    }
}
