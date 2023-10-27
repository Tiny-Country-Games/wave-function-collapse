import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {IconName} from "@fortawesome/fontawesome-svg-core";
import moment from "moment";

declare global {
    type InputFieldLabel = {
        floatingLabel?: false;
        label?: React.ReactNode;
    };

    type InputFieldFloatingLabel = {
        floatingLabel: true;
        label: React.ReactNode;
    };

    type BaseInputField<V> = (InputFieldLabel | InputFieldFloatingLabel) & {
        touched: boolean;
        valid: boolean;
        domId: string;
        icon?: IconDefinition | IconName | string;
        hideValid?: boolean;

        value: V;
        filter?: (value: V) => V;
        validator?: (value: V) => boolean;
    };

    type TextInputType = BaseInputField<string> & {
        type: 'text';
        placeholder?: string;
    };

    type ReadonlyTextInputType = Omit<TextInputType, 'type'> & {
        type: 'readonly-text';
    }

    type TextAreaInputType = Omit<TextInputType, 'type'> & {
        type: 'textarea';
    };

    type PasswordInputType = BaseInputField<string> & {
        type: 'password';
        placeholder?: string;
    }

    type SingleSelectInputType<T> = Omit<BaseInputField<T>, 'filter'> & {
        type: 'single-select';
        options: T[];
        optionDisplay: (option: T) => React.ReactNode;
        optionValue: (option: T) => string;
        optionFromValue: (value: string, options: T[]) => T | undefined;
    };

    type CheckBoxButtonInputType = Omit<BaseInputField<boolean>, 'filter' | 'validator' | 'floatingLabel' | 'label' | 'icon'> & {
        type: 'checkbox-button';
        label: React.ReactNode;
        floatingLabel?: false;
        icon?: never;
    }

    type DateInputType = Omit<BaseInputField<moment.Moment>, 'filter' | 'floatingLabel'> & {
        type: 'date';
        floatingLabel?: false;
        closeOnSelect?: boolean;
    }

    type InputType = TextInputType
        | PasswordInputType
        | SingleSelectInputType
        | TextAreaInputType
        | CheckBoxButtonInputType
        | DateInputType
        | ReadonlyTextInputType
        ;

    type InputForm = {
        [key: string]: InputType;
    };

}
