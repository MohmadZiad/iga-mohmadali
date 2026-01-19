import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-reset-password',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
    router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    authService = inject(AuthService);
    isPasswordVisible = false;
    isConfirmPasswordVisible = false;
    passwordVisibilityIcon = 'assets/icons/visibility-off-icon.svg';
    confirmPasswordVisibilityIcon = 'assets/icons/visibility-off-icon.svg';

    accessToken: string | null = null;

    form: FormGroup = new FormGroup({
        password: new FormControl(null, Validators.required),
        confirmPassword: new FormControl(null, Validators.required),
    });

    ngOnInit(): void {
        this.route.fragment.subscribe((fragment) => {
            if (fragment) {
                const params = new URLSearchParams(fragment);
                this.accessToken = params.get('access_token');
                console.log('Access Token:', this.accessToken);
            }
        });
    }

    changeVisiblePassword() {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.passwordVisibilityIcon = this.isPasswordVisible
            ? 'assets/icons/visibility-icon.svg'
            : 'assets/icons/visibility-off-icon.svg';
    }

    changeVisibleConfirmPassword() {
        this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
        this.confirmPasswordVisibilityIcon = this.isConfirmPasswordVisible
            ? 'assets/icons/visibility-icon.svg'
            : 'assets/icons/visibility-off-icon.svg';
    }

    updatePassword() {
        if (this.form.valid && this.form.value.password === this.form.value.confirmPassword) {
            this.authService.token = this.accessToken;
            const password = this.form.value.password;
            this.authService.updatePassword(password).subscribe(() => {
                this.openLoginPage();
            });
        }
    }

    openLoginPage() {
        this.router.navigate(['login']);
    }
}
