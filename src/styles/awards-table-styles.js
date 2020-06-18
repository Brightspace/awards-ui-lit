import { css } from 'lit-element/lit-element';

export const awardsTableStyles = css`
table {
	background-color: transparent;
	width: 100%;
	height: 41px;
	border:1px solid #cdd5dc;
	border-color: var(--d2l-color-mica);
	border-collapse: collapse;
	border-spacing: 0;
	border-radius: 0.3rem;
	font-size: 0.8rem;
	font-weight: 400;
}

td, th {
	background-color: #ffffff;
	border:1px solid #cdd5dc;
	padding: 0.5rem 1rem;
	vertical-align: middle;
}

th {
	background-color: #f9fbff;
	font-size: 0.7rem;
	line-height: 1rem;
	text-align: left;
	margin: 1rem 0;
}

td.centered-column {
	text-align: center;
}

td.award_icon {
	padding-top: 1rem;
}

:host([dir="rtl"]) th {
	text-align: right;
}

table thead > tr:first-child {
	border-top-style: none;
	border-left-style: none;
}
`;
