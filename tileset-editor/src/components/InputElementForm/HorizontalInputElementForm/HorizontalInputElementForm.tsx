import {Col, Row} from "react-bootstrap";
import InputElement from "../../InputElement/InputElement";

type HorizontalInputElementFormProps<T extends InputForm> = InputElementFormProps<T> & {
    equalWidth?: boolean;
};

type InputElementColProps<T extends InputForm> = HorizontalInputElementFormProps<T> & {
    elementKey: string;
    element: InputType;
};

const InputElementCol = <T extends InputForm>(props: InputElementColProps<T>) => {
    const {
        spacing,
        equalWidth,
        element,
        elementKey,
        onChange,
    } = props;
    return (
        <Col className={`mb-${spacing ?? 2} mb-lg-0`} xs={12} lg={equalWidth ? true : 'auto'}>
            <InputElement
                element={element}
                onChange={(value) => onChange(elementKey, value)}
            />
        </Col>
    )
}

const HorizontalInputElementForm = <T extends InputForm>(props: HorizontalInputElementFormProps<T>) => {
    const {
        spacing,
        form,
        includedKeys,
    } = props;
    const keys = includedKeys ?? Object.keys(form);
    return (
        <Row  className={`${spacing === undefined ? '' : `g-${spacing}`} mb-${spacing ?? 2}`}>
            {keys.map((key) => {
                const element = form[key];
                return (
                    <InputElementCol
                        key={element.domId}
                        elementKey={key}
                        element={element}
                        {...props}
                    />
                );
            })}
        </Row>
    );
};

export default HorizontalInputElementForm;
