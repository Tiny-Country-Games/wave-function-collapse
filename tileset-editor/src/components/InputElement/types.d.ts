import React from "react";

declare global {
    type InputElementProps = {
        element: InputType;
        onChange: (value: any) => void;
        onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    };
}
