import {Form} from "react-bootstrap";

type TextElementProps = Omit<InputElementProps, 'element'> & {
    element: TextAreaInputType;
};

const TextAreaElement = (props: TextElementProps) => {
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
    } = props;
    return (
        <Form.Control
            as={'textarea'}
            placeholder ={placeholder ?? (typeof label === 'string' ? label : undefined)}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            isInvalid={touched && !valid}
            isValid={valid && !hideValid}
        />
    );
};

export default TextAreaElement;
