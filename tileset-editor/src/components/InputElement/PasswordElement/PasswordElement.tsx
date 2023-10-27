import {Form} from "react-bootstrap";

type TextElementProps = Omit<InputElementProps, 'element'> & {
    element: PasswordInputType;
};

const PasswordElement = (props: TextElementProps) => {
    const {
        element: {
            label,
            value,
            touched,
            valid,
            hideValid,
            placeholder,
        },
        onChange,
    } = props;
    return (
        <Form.Control
            type={'password'}
            placeholder ={placeholder ?? (typeof label === 'string' ? label : undefined)}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            isInvalid={touched && !valid}
            isValid={valid && !hideValid}
        />
    );
};

export default PasswordElement;
