import {Form} from "react-bootstrap";
import {ChangeEvent} from "react";

type SingleSelectElementProps<T> = Omit<InputElementProps, 'element'> & {
    element: SingleSelectInputType<T>;
};

type SingleSelectElementOptionProps<T> = SingleSelectElementProps<T> & {
    option: T;
}

const SingleSelectElementOption = <T extends unknown>(props: SingleSelectElementOptionProps<T>) => {
    const {
        element: {
            optionDisplay,
            optionValue,
        },
        option
    } = props;
    const value = optionValue(option);
    const display = optionDisplay(option);
    return (
        <option value={value}>{display}</option>
    )
};

const SingleSelectElement = <T extends unknown>(props: SingleSelectElementProps<T>) => {
    const {
        element: {
            options,
            value,
            optionValue,
            optionFromValue,
        },
        onChange
    } = props;
    const currentValue = optionValue(value);

    const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        const nextValue = optionFromValue(event.target.value, options);
        if (!nextValue) return;
        onChange(nextValue);
    }

    return (
        <Form.Select
            value={currentValue}
            onChange={onSelectChange}
        >
            {options.map((option, index) => (
                <SingleSelectElementOption
                    key={index}
                    option={option}
                    {...props}
                />
            ))}
        </Form.Select>
    )
};

export default SingleSelectElement;
