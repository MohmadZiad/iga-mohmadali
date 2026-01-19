import { NotificationsService } from './../../shared/notifications/notifications.service';
import { Component, inject, ElementRef, afterNextRender } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { APP_VERSION } from '../../../environments/environments';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private notifications = inject(NotificationsService);
    appVersion = APP_VERSION;

    constructor(elementRef: ElementRef) {
        afterNextRender(() => {
            // Focus the first input element in this component.
            elementRef.nativeElement.querySelector('input')?.focus();
        });
    }

    loginForm: FormGroup = new FormGroup({
        username: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required),
    });

    isPasswordVisible = false;
    iconVisible = 'assets/icons/visibility-off-icon.svg';

    changeVisiblePassword() {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.iconVisible = this.isPasswordVisible ? 'assets/icons/visibility-icon.svg' : 'assets/icons/visibility-off-icon.svg';
    }

    login() {
        if (this.loginForm.valid) {
            const username = this.loginForm.value.username;
            const password = this.loginForm.value.password;
            this.authService.login(username, password).subscribe({
                complete: () => {
                    this.router.navigate(['']);
                },
                error: (error: HttpErrorResponse) => {
                    this.notifications.show(error.error.error.message);
                },
            });
        }
    }

    openForgotPasswordPage() {
        this.router.navigate(['forgot-password']);
    }
}
