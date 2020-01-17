import { baseURL } from '../../config';
import { ReportRequest } from './types';

export const getReportMonth = (
	reportRequest: ReportRequest,
): Promise<Response> => {
	const { username, password, month, year,personID } = reportRequest;
	const url =
		baseURL +
		'/Reports/GetMonthlyReport?' +
		`username=${username}&password=${password}&month=${month}&year=${year}&PersonID=${personID}`;
	return fetch(url);
};
