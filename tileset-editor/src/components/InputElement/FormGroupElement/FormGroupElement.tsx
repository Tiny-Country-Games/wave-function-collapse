import TextElement from "../TextElement/TextElement";
import {FloatingLabel, Form, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import PasswordElement from "../PasswordElement/PasswordElement";
import TextAreaElement from "../TextAreaElement/TextAreaElement";
import SingleSelectElement from "../SingleSelectElement/SingleSelectElement";

const Element = (props: InputElementProps) => {
    const {element: {type}} = props;
    switch (type) {
        case 'text':
            return <TextElement {...props} />;
        case 'password':
            return <PasswordElement {...props} />;
        case 'textarea':
            return <TextAreaElement {...props} />;
        case 'single-select':
            return <SingleSelectElement {...props} />;
        case 'readonly-text':
            return <TextElement {...props} readonly/>;
        default:
            return null;
    }
}

type ElementIconProps = InputElementProps & {
    fixedWidth?: boolean;
    iconClassName?: string;
};

const ElementIcon = ({element: {icon}, iconClassName, fixedWidth}: ElementIconProps) => {
    if (!icon) return null;
    return <FontAwesomeIcon icon={icon} className={iconClassName} fixedWidth={fixedWidth}/>;
};

const FloatingLabelElement = (props: InputElementProps) => {
    const {
        element: {
            floatingLabel,
            label,
            domId,
        }
    } = props;
    if (!floatingLabel) return null;
    return (
        <FloatingLabel
            label={<>
                <ElementIcon {...props} fixedWidth iconClassName={'me-2'}/>{label}
            </>}
            controlId={domId}
        >
            <Element {...props}/>
        </FloatingLabel>
    )
}

const FormLabel = (props: InputElementProps) => {
    const {
        element: {
            label,
        },
    } = props;
    if (!label) return null;
    return <Form.Label>{label}</Form.Label>;
}

const FormIconGroup = (props: InputElementProps) => {
    const {
        element: {
            icon,
        },
    } = props;
    if (!icon) return null;
    return (
        <InputGroup.Text>
            <ElementIcon {...props} fixedWidth/>
        </InputGroup.Text>
    );
}

const FormGroupContents = (props: InputElementProps) => {
    const {
        element: {
            floatingLabel,
        },
    } = props;
    if (floatingLabel) return <FloatingLabelElement {...props}/>;
    return (
        <>
            <FormLabel {...props}/>
            <InputGroup>
                <FormIconGroup {...props}/>
                <Element {...props}/>
            </InputGroup>
        </>
    )
}

const FormGroupElement = (props: InputElementProps) => {
    const {element: {domId}} = props;

    return (
        <Form.Group controlId={domId}>
            <FormGroupContents {...props}/>
        </Form.Group>
    );
};

export default FormGroupElement;
