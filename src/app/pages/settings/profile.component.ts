import { Component, inject } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../data/api-services/user/user.service';

@Component({
    selector: 'app-profile',
    imports: [MatTab, MatTabGroup, FormsModule, ReactiveFormsModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent {
    private formBuilder = inject(FormBuilder);
    private authService = inject(AuthService);
    private userService = inject(UserService);

    changeNameForm = this.formBuilder.group({
        fullName: [this.userService.authUser.fullName, [Validators.required]],
        mobileNumber: [this.userService.authUser.phone, []],
    });

    changePasswordForm = this.formBuilder.group({
        newPassword: [null, [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: [null, [Validators.required, Validators.minLength(6)]],
    });

    submitUserData() {
        if (!this.changeNameForm.valid) {
            return;
        }
        this.userService
            .update({ fullName: this.changeNameForm.value.fullName!, phone: this.changeNameForm.value.mobileNumber! })
            .pipe()
            .subscribe();
    }

    submitNewPassword() {
        if (!this.changePasswordForm.valid) {
            return;
        }
        if (this.changePasswordForm.value.confirmNewPassword !== this.changePasswordForm.value.newPassword) {
            return;
        }
        this.authService.updatePassword(this.changePasswordForm.value.newPassword!).subscribe();
    }
}
