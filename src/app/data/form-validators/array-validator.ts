import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function arrayValidator(allowedValues: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Allow empty values if not required
        }
        return allowedValues.includes(control.value) ? null : { arrayInvalid: { validValues: allowedValues } };
    };
}
