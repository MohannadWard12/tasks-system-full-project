/* eslint-disable react/prop-types */
import { useState } from "react";
import Datepicker from "tailwind-datepicker-react"

const options = {
	autoHide: true,
	todayBtn: false,
	clearBtn: false,
	clearBtnText: "Clear",
	minDate: new Date(),
	theme: {
		background: "bg-gray-700 dark:bg-gray-800",
		todayBtn: "",
		clearBtn: "",
		icons: "",
		text: "text-white",
		input: "",
		inputIcon: "",
		selected: "",
	},
	datepickerClassNames: "top-12",
	defaultDate: new Date(),
	language: "en",
	disabledDates: [],
	weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	inputNameProp: "date",
	inputIdProp: "date",
	inputPlaceholderProp: "Select Date",
	inputDateFormatProp: {
		day: "numeric",
		month: "numeric",
		year: "numeric"
	}
}

const DateInput = ({ value, onChange }) => {
	const [show, setShow] = useState(false);

	const handleClose = (state) => {
		setShow(state)
	}

	return (
		<div>
			<Datepicker options={options} value={value} onChange={onChange} show={show} setShow={handleClose} />
		</div>
	)
}

export default DateInput;