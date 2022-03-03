import { FormGroup } from '@angular/forms';

export class EventModel {
    email: string;
    password: string;

    static mapFormGroupToFormData(formGroup: FormGroup): FormData {
        if (!formGroup)
            return null;

        let email = formGroup.get('email')?.value;
        let password = formGroup.get('password')?.value;

        email = (!email) ? '' : email;
        password = (!password) ? '' : password;

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        return formData;
    }

    static appendIndependentPropsToFormData(formData: FormData, logo: File): void {

        if (logo) {
            formData.append('logo', logo, logo.name);
        } 
    }
}