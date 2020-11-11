import { css } from 'lit-element/lit-element';

export const awardsTableStyles = css`
.table{
	background-color: transparent;
	width: 100%;
	height: 41px;
	border-spacing: 0;
	border-radius: 0.3rem;
	font-size: 0.8rem;
	font-weight: 400;
}
.table__td {
	background-color: #ffffff;
	border-top: 1px solid #cdd5dc;
	border-left: 1px solid #cdd5dc;
	padding: 0.5rem 1rem;
	vertical-align: middle;
}
.table__th {
	background-color: #f9fbff;
	border-top: 1px solid #cdd5dc;
	border-left: 1px solid #cdd5dc;
	font-size: 0.7rem;
	line-height: 1rem;
	text-align: left;
	margin: 1rem 0;
	white-space: nowrap;
	padding: 0.5rem 1rem;
	vertical-align: middle;
}
.table__td--center {
	text-align: center;
}

.-pad-top {
	padding-top: 1rem;
}

:host([dir="rtl"]) th {
	text-align: right;
}

/*
** These would be a huge pain to do with BEM
** so they will stay a selector
*/
.table thead > tr:first-child {
	border-top-style: none;
	border-left-style: none;
}

.table thead > tr > th:first-child {
	border-radius: 0.3rem 0 0 0;
}

.table thead > tr > th:last-child {
	border-radius: 0 0.3rem 0 0;
	border-right: 1px solid #cdd5dc;
}

.table tr:last-child > td:first-child {
	border-radius: 0 0 0 0.3rem;
}

.table tr:last-child > td:last-child {
	border-radius: 0 0 0.3rem 0;
}

.table tr:last-child > td {
	border-bottom: 1px solid #cdd5dc;
}

.table tr > td:last-child{
	border-right: 1px solid #cdd5dc;
}
`;
