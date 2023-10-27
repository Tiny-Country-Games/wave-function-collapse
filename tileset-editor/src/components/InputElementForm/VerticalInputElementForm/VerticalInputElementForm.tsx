import {Col, Row} from "react-bootstrap";
import InputElement from "../../InputElement/InputElement";

type VerticalInputElementFormProps<T extends InputForm> = InputElementFormProps<T> & {};

type InputElementRowProps<T extends InputForm> = VerticalInputElementFormProps<T> & {
    elementKey: string;
    element: InputType;
};

const InputElementRow = <T extends InputForm>(props: InputElementRowProps<T>) => {
    const {
        element,
        elementKey,
        onChange,
        spacing,
    } = props;
    return (
        <Row className={`mb-${spacing ?? 2}`}>
            <Col>
                <InputElement
                    element={element}
                    onChange={(value) => onChange(elementKey, value)}
                />
            </Col>
        </Row>
    )
}

const VerticalInputElementForm = <T extends InputForm>(props: VerticalInputElementFormProps<T>) => {
    const {
        form,
        includedKeys,
    } = props;
    const keys = includedKeys ?? Object.keys(form);
    return (
        <>
            {keys.map((key) => {
                const element = form[key];
                return (
                    <InputElementRow
                        key={element.domId}
                        elementKey={key}
                        element={element}
                        {...props}
                    />
                );
            })}
        </>
    );
};

export default VerticalInputElementForm;
