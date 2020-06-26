import dayjs from 'dayjs/esm';
const NEVER_EXPIRATION = 'Never';

export const convertToDateString = (dateStr) => {
	if (dateStr === NEVER_EXPIRATION || !dateStr) {
		return dateStr;
	}

	const formattedStr = dayjs(dateStr).format('dddd, MMMM D, YYYY h:mm A');
	return formattedStr;
};
