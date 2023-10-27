import {Col, Form, ListGroup, OverlayTrigger, Popover, Row} from "react-bootstrap";
import ConditionalComponent from "../../../hoc/ConditionalComponent/ConditionalComponent";
import IconText from "../../IconText/IconText";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import CalendarSelector from "../../CalendarSelector/CalendarSelector";

import styles from './DateElement.module.scss';
import {useState} from "react";
import moment from "moment";

type DateElementProps = Omit<InputElementProps, 'element'> & {
    element: DateInputType;
};

const LabelCol = (props: DateElementProps) => {
    const {
        element: {
            label,
            icon,
            domId
        }
    } = props;
    if (!label) return null;
    return (
        <Col xs={12} lg={'auto'}>
            <Form.Label htmlFor={domId} className={'mb-0'}>
                <ConditionalComponent show={!!icon}>
                    <IconText icon={icon! as IconProp}>{label}</IconText>
                </ConditionalComponent>
                <ConditionalComponent show={!icon}>
                    {label}
                </ConditionalComponent>
            </Form.Label>
        </Col>
    )
};

const SelectorTrigger = (props: DateElementProps) => {
    const {
        element: {
            domId,
            value,
            closeOnSelect
        },
        onChange,
    } = props;
    const [show, setShow] = useState<boolean>(false);

    const onSelectDate = (nextValue: moment.Moment) => {
        onChange(nextValue);
        if(closeOnSelect) {
            setShow(false);
        }
    }

    return (
        <Col>
            <OverlayTrigger
                placement={'bottom-start'}
                trigger={'click'}
                show={show}
                onToggle={(nextShow) => setShow(nextShow)}
                overlay={
                    <Popover id={`${domId}-popover`} className={styles.DateSelectorPopover}>
                        <Popover.Body className={`p-1`}>
                            <CalendarSelector
                                value={value}
                                onChange={onSelectDate}
                            />
                        </Popover.Body>
                    </Popover>
                }
            >
                {({ref, ...triggerHandler}) => (
                    <ListGroup>
                        <ListGroup.Item
                            type={'button'}
                            ref={ref}
                            id={domId}
                            action
                            active={show}
                            {...triggerHandler}
                        >{value.format('M/D/YYYY')}</ListGroup.Item>
                    </ListGroup>
                )}
            </OverlayTrigger>
        </Col>
    );
};

const DateElement = (props: DateElementProps) => {
    return (
        <Row className={'g-2 align-items-baseline'}>
            <LabelCol {...props}/>
            <SelectorTrigger {...props}/>
        </Row>
    );
};

export default DateElement;
