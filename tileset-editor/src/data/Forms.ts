type UpdateFormParam<T extends InputForm> = {
    key: string;
    value: any;
    form: T;
};
type UpdateFormResult<T extends InputForm> = {
    form: T;
    formValid: boolean;
};

export namespace Forms {

    export const isFormValid = (form: InputForm) => {
        let formValid: boolean = true;
        for (const key in form) {
            formValid = formValid && form[key].valid;
        }
        return formValid;
    }

    export const updateForm = <T extends InputForm>({key, value, form}: UpdateFormParam<T>): UpdateFormResult<T> => {
        const updatedForm: InputForm = {
            ...form,
        };

        const updatedFormElement: InputType = {
            ...updatedForm[key],
        };

        updatedFormElement.value = updatedFormElement.filter ? updatedFormElement.filter(value) : value;
        updatedFormElement.valid = updatedFormElement.validator ? updatedFormElement.validator(updatedFormElement.value) : true;
        updatedFormElement.touched = true;

        updatedForm[key] = updatedFormElement;
        const formValid = isFormValid(updatedForm);
        updatedForm[key] = updatedFormElement;

        return {form: updatedForm as T, formValid: formValid};
    }

    export const filterAndValidateForm = <T extends InputForm>(form: T): UpdateFormResult<T> => {
        const updatedForm: InputForm = {
            ...form,
        };
        for (const key in updatedForm) {
            const updatedFormElement: InputType = {
                ...updatedForm[key],
            };
            updatedFormElement.value = updatedFormElement.filter ? updatedFormElement.filter(updatedFormElement.value) : updatedFormElement.value;
            updatedFormElement.valid = updatedFormElement.validator ? updatedFormElement.validator(updatedFormElement.value) : true;
            updatedForm[key] = updatedFormElement;
        }
        const formValid = isFormValid(updatedForm);
        return {form: updatedForm as T, formValid: formValid};
    }

}

export namespace Validators {
    export const requiredText = (value: string) => value.trim() !== '';
}
