import {Table} from "react-bootstrap";
import styles from './CalendarSelector.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretLeft, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import moment from "moment";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

type CalendarScope = 'month' | 'year' | 'decade';

type CalendarSelectorProps = {
    value: moment.Moment;
    onChange: (value: moment.Moment) => void;
};

type DateTableProps = CalendarSelectorProps & {
    currentMonth: moment.Moment;
    setCurrentMonth: React.Dispatch<React.SetStateAction<moment.Moment>>;
    setCurrentCalendarScope: React.Dispatch<React.SetStateAction<CalendarScope>>;
};

type NextPreviousColumnProps = {
    onClick?: () => void;
};

const NextPreviousColumn = ({icon, onClick}: NextPreviousColumnProps & { icon: IconProp }) => {
    return (
        <th
            className={`text-center ${styles.ClickableTableColumn}`}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={icon} fixedWidth/>
        </th>
    )
};

const NextColumn = (props: NextPreviousColumnProps) => <NextPreviousColumn {...props} icon={faCaretRight}/>;

const PreviousColumn = (props: NextPreviousColumnProps) => <NextPreviousColumn {...props} icon={faCaretLeft}/>;

const MonthTable = (props: DateTableProps) => {
    const {
        currentMonth,
        value,
        onChange,
        setCurrentMonth,
        setCurrentCalendarScope,
    } = props;

    const firstDayOfMonth = (() => {
        if (currentMonth.day() === 0) return moment(currentMonth).subtract(1, 'week');
        return moment(currentMonth).startOf('week');
    })();
    const lastDayOfMonth = moment(firstDayOfMonth).add(5, 'weeks').endOf('week');
    const days = (() => {
        const allDays: moment.Moment[][] = [];
        const currentDay = moment(firstDayOfMonth);
        while (currentDay.isBefore(lastDayOfMonth)) {
            const week: moment.Moment[] = [];
            for (let i = 0; i < 7; i++) {
                week.push(moment(currentDay));
                currentDay.add(1, 'day');
            }
            allDays.push(week);
        }
        return allDays;
    })();
    const previousMonthSelect = () => setCurrentMonth(moment(currentMonth).subtract(1, 'month').startOf('month'));
    const nextMonthSelect = () => setCurrentMonth(moment(currentMonth).add(1, 'month').startOf('month'));
    const isDateSelected = (date: moment.Moment) => date.isSame(value, 'day');
    const onSelectDate = (date: moment.Moment) => onChange(moment(date).startOf('day'));
    return (
        <Table borderless>
            <thead>
            <tr>
                <PreviousColumn onClick={() => previousMonthSelect()}/>
                <th
                    className={`text-center ${styles.ClickableTableColumn}`}
                    colSpan={5}
                    onClick={() => setCurrentCalendarScope('year')}
                >{currentMonth.format('MMMM YYYY')}</th>
                <NextColumn onClick={() => nextMonthSelect()}/>
            </tr>
            <tr>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <th
                        key={day}
                        className={'text-center'}
                    >{day}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {days.map((week, weekIndex) => (
                <tr key={weekIndex}>
                    {week.map(day => {
                        const classes = new Set<string>([
                            'text-center',
                            'py-1',
                            styles.ClickableTableColumn,
                            ...(isDateSelected(day) ? [styles.SelectedDate] : []),
                            ...(day.isSame(currentMonth, 'month') ? [] : ['text-muted', styles.DifferentMonth]),
                            ...(day.isSame(moment(), 'day') ? [styles.Today] : []),
                        ]);
                        return (
                            <td
                                className={[...classes].join(' ')}
                                onClick={() => onSelectDate(day)}
                                key={day.format('YYYY-MM-DD')}
                            >
                                {day.format('D')}
                            </td>
                        )
                    })}
                </tr>
            ))}
            </tbody>
        </Table>
    )
};

const YearTable = (props: DateTableProps) => {
    const {
        currentMonth,
        setCurrentCalendarScope,
        setCurrentMonth,
        value,
    } = props;
    const startOfYear = moment(currentMonth).startOf('year');
    const months = (() => {
        const months: moment.Moment[][] = [];
        const currentMonth = moment(startOfYear);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                if (!months[i]) months[i] = [];
                months[i].push(moment(currentMonth));
                currentMonth.add(1, 'month');
            }
        }
        return months;
    })();
    const onMonthClick = (month: moment.Moment) => {
        setCurrentMonth(month.startOf('month'));
        setCurrentCalendarScope('month');
    };
    const previousYear = () => setCurrentMonth(moment(startOfYear).subtract(1, 'year').startOf('month'));
    const nextYear = () => setCurrentMonth(moment(startOfYear).add(1, 'year').startOf('month'));

    const isMonthSelected = (month: moment.Moment) => moment(value).isSame(month, 'month');

    const isCurrentMonth = (month: moment.Moment) => moment().isSame(month, 'month');

    return (
        <Table borderless>
            <thead>
            <tr>
                <PreviousColumn onClick={previousYear} />
                <th
                    className={`text-center ${styles.ClickableTableColumn}`}
                    colSpan={2}
                    onClick={() => setCurrentCalendarScope('decade')}
                >{currentMonth.format('YYYY')}</th>
                <NextColumn onClick={nextYear} />
            </tr>
            </thead>
            <tbody>
            {months.map((monthRow, monthIndex) => (
                <tr key={monthIndex}>
                    {monthRow.map(month => {
                        const classes = new Set<string>([
                            'text-center',
                            'py-3',
                            styles.ClickableTableColumn,
                            ...(isMonthSelected(month) ? [styles.SelectedDate] : []),
                            ...(isCurrentMonth(month) ? [styles.Today] : []),
                        ]);
                        return (
                            <td
                                key={month.format('YYYY-MM')}
                                className={[...classes].join(' ')}
                                onClick={() => onMonthClick(month)}
                            >
                                {month.format('MMM')}
                            </td>
                        )
                    })}
                </tr>
            ))}
            </tbody>
        </Table>
    )
};

const DecadeTable = (props: DateTableProps) => {
    const {
        currentMonth,
        setCurrentCalendarScope,
        setCurrentMonth,
        value,
    } = props;
    const startOfDecade= (() => {
        const year = moment(currentMonth).year();
        return moment(currentMonth).year((year - (year % 10)) - 1).startOf('year');
    })();
    const endOfDecade = moment(startOfDecade).add(11, 'years');
    const years = (() => {
        const years: moment.Moment[][] = [];
        const currentYear = moment(startOfDecade);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                if (!years[i]) years[i] = [];
                years[i].push(moment(currentYear));
                currentYear.add(1, 'year');
            }
        }
        return years;
    })();

    const previousDecade = () => setCurrentMonth(moment(startOfDecade).subtract(1, 'year').startOf('month'));
    const onNextDecade = () => setCurrentMonth(moment(endOfDecade).add(1, 'year').startOf('month'));

    const isYearSelected = (year: moment.Moment) => moment(value).isSame(year, 'year');

    const isCurrentYear = (year: moment.Moment) => moment().isSame(year, 'year');

    const onYearClick = (year: moment.Moment) => {
        setCurrentMonth(moment(year).startOf('year'));
        setCurrentCalendarScope('year');
    }

    return (
        <Table borderless>
        <thead>
        <tr>
            <PreviousColumn onClick={previousDecade}/>
            <th
                className={`text-center ${styles.ClickableTableColumn}`}
                colSpan={2}
            >{startOfDecade.format('YYYY')} - {endOfDecade.format('YYYY')}</th>
            <NextColumn onClick={onNextDecade}/>
        </tr>
        </thead>
            <tbody>
            {years.map((yearRow, yaerIndex) => (
                <tr key={yaerIndex}>
                    {yearRow.map(year => {
                        const classes = new Set<string>([
                            'text-center',
                            'py-3',
                            styles.ClickableTableColumn,
                            ...(isYearSelected(year) ? [styles.SelectedDate] : []),
                            ...(isCurrentYear(year) ? [styles.Today] : []),
                        ]);
                        return (
                            <td
                                key={year.format('YYYY-MM')}
                                className={[...classes].join(' ')}
                                onClick={() => onYearClick(year)}
                            >
                                {year.format('YYYY')}
                            </td>
                        )
                    })}
                </tr>
            ))}
            </tbody>
        </Table>
    )
};

const CalendarSelector = (props: CalendarSelectorProps) => {
    const {
        value
    } = props;
    const [currentMonth, setCurrentMonth] = useState<moment.Moment>(moment(value).startOf('month'));
    const [currentCalendarScope, setCurrentCalendarScope] = useState<CalendarScope>('month');
    useEffect(() => {
        setCurrentMonth(moment(value).startOf('month'));
    }, [value.format()])

    const tableProps: DateTableProps = {
        ...props,
        currentMonth,
        setCurrentMonth,
        setCurrentCalendarScope,
    };

    switch (currentCalendarScope) {
        case 'month':
            return <MonthTable {...tableProps}/>;
        case 'year':
            return <YearTable {...tableProps}/>;
        case 'decade':
            return <DecadeTable {...tableProps}/>;
        default:
            return null;
    }

};
export default CalendarSelector;
