import {ListGroup} from "react-bootstrap";
import IconText from "../../IconText/IconText";
import {faCheckSquare, faSquare} from "@fortawesome/free-regular-svg-icons";

type CheckBoxButtonElementProps = Omit<InputElementProps, 'element'> & {
    element: CheckBoxButtonInputType;
};

const CheckBoxButtonElement = (props: CheckBoxButtonElementProps) => {
    const {
        element: {
            value: isChecked,
            label,
        },
        onChange,
    } = props;
    return (
        <ListGroup>
            <ListGroup.Item
                onClick={() => onChange(!isChecked)}
                active={isChecked}
                action
                aria-checked={isChecked}
                role={'checkbox'}
                type={'button'}
            >
                <IconText icon={isChecked ? faCheckSquare : faSquare}>{label}</IconText>
            </ListGroup.Item>
        </ListGroup>
    );
};

export default CheckBoxButtonElement;
