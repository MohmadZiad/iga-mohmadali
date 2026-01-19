import * as Papa from 'papaparse';
import * as ExcelJS from 'exceljs';

type csvLines = (string | number | boolean)[][];
type csvRecords = Record<string, string | number | boolean>[];
export default class DownloadService {
    static downloadCsv = (data: csvLines | csvRecords, fileName?: string) => {
        const csv = Array.isArray(data[0]) ? Papa.unparse(data as csvLines) : Papa.unparse(data as csvRecords, { header: true });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        fileName ||= `report_${Date.now()}.csv`;
        DownloadService.downloadFile(url, fileName);
    };

    static downloadExcel = async (data: (string | number)[][], fileName?: string) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1', { views: [{ state: 'frozen', ySplit: 1 }] });

        worksheet.addRows(data);

        const bufferFile = await workbook.xlsx.writeBuffer();
        const blob = new Blob([bufferFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = window.URL.createObjectURL(blob);
        fileName ||= `report_${Date.now()}.xlsx`;
        DownloadService.downloadFile(url, fileName);
    };

    static downloadFile = (url: string, fileName: string) => {
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
}
