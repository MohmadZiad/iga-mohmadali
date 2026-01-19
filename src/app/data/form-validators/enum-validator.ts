import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function enumValidator(enumType: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Allow empty values if not required
        }
        const validValues = Object.values(enumType);
        return validValues.includes(control.value) ? null : { enumInvalid: { validValues } };
    };
}
