import FormGroupElement from "./FormGroupElement/FormGroupElement";
import CheckBoxButtonElement from "./CheckBoxButtonElement/CheckBoxButtonElement";
import DateElement from "./DateElement/DateElement";

const InputElement = (props: InputElementProps) => {
    const {element: {type}} = props;
    switch (type) {
        case 'text':
        case 'password':
        case 'single-select':
        case 'textarea':
        case "readonly-text":
            return <FormGroupElement {...props} />;
        case 'checkbox-button':
            return <CheckBoxButtonElement {...props} />;
        case 'date':
            return <DateElement {...props}/>
        default:
            return null;
    }
};

export default InputElement;
