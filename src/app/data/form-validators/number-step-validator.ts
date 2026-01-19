import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numberStepValidator(step: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Allow empty values if not required
        }
        const isValid = control.value % step === 0;
        return isValid ? null : { numberStepInvalid: { step } };
    };
}
