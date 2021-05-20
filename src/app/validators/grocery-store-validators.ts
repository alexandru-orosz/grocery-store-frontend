import { FormControl, ValidationErrors } from "@angular/forms";

export class GroceryStoreValidators {

    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        if(control.value != null && control.value.trim().length === 0) {
            //invalid
            return { 'notOnlyWhitespace': true };
        } 
        else {
            //valid
            return null;
        }
    }

}
