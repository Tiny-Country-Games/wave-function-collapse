import {Form} from "react-bootstrap";

type TextElementProps = Omit<InputElementProps, 'element'> & {
    element: TextInputType;
    readonly?: boolean;
};

const TextElement = (props: TextElementProps) => {
    const {
        element: {
            placeholder,
            label,
            value,
            touched,
            valid,
            hideValid,
        },
        onChange,
        readonly,
    } = props;
    return (
        <Form.Control
            type={'text'}
            placeholder ={placeholder ?? (typeof label === 'string' ? label : undefined)}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            isInvalid={touched && !valid}
            isValid={valid && !hideValid}
            readOnly={readonly}
            disabled={readonly}
        />
    );
};

export default TextElement;
