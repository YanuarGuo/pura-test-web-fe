import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // Import file-saver for saving files in the browser

async function exportToExcel(jsonData: any, title: string) {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Add JSON data to the worksheet
  const keys = Object.keys(jsonData[0]); // Get headers from the first row of JSON data
  worksheet.addRow(keys); // Add headers to the worksheet

  // Add the rows of data
  jsonData.forEach((data: any) => {
    worksheet.addRow(Object.values(data)); // Add the row values
  });

  // Format number columns
  const numCols = [
    "Frekuensi",
    "Jumlah",
    "Jumlah Total",
    "Harga Satuan",
    "Sub Total",
  ];
  worksheet.eachRow((row, rowNumber) => {
    numCols.forEach((col) => {
      const colIndex = keys.indexOf(col) + 1;
      const cell = row.getCell(colIndex);
      if (!isNaN(cell.value as any)) {
        cell.numFmt = "#,##0"; // Number format with thousand separators
      }
    });
  });

  // Format date columns
  const dateCols = ["Tanggal Awal", "Tanggal Akhir"];
  worksheet.eachRow((row, rowNumber) => {
    dateCols.forEach((col) => {
      const colIndex = keys.indexOf(col) + 1;
      const cell = row.getCell(colIndex);
      if (cell.value) {
        cell.numFmt = "d mmmm yyyy"; // Format as "5 January 2025"
      }
    });
  });

  // Calculate the total of the "Sub Total" column
  const subTotalColIndex = keys.indexOf("Sub Total") + 1;
  let totalSum = 0;

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // Skip the header row
      const subTotalCell = row.getCell(subTotalColIndex);
      if (!isNaN(subTotalCell.value as any)) {
        totalSum += Number(subTotalCell.value);
      }
    }
  });

  // Add a total row at the bottom
  const totalRow = worksheet.addRow([]);
  totalRow.getCell(1).value = "Total";
  totalRow.getCell(subTotalColIndex).value = totalSum;
  totalRow.getCell(subTotalColIndex).numFmt = "#,##0"; // Format total as number with thousand separators

  // Apply bold styling to the total row
  totalRow.font = { bold: true };

  // Apply borders to each cell, including the total row
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.border = {
        top: { style: "medium" as ExcelJS.BorderStyle },
        bottom: { style: "medium" as ExcelJS.BorderStyle },
        left: { style: "medium" as ExcelJS.BorderStyle },
        right: { style: "medium" as ExcelJS.BorderStyle },
      };
    });
  });

  // Create a Blob and use file-saver to download it in the browser
  const buffer = await workbook.xlsx.writeBuffer(); // Write workbook to buffer
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Use file-saver to save the file
  saveAs(blob, `${title}.xlsx`);
}
async function exportRekapToExcel(jsonData: any, title: string) {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Add JSON data to the worksheet
  const keys = Object.keys(jsonData[0]); // Get headers from the first row of JSON data
  worksheet.addRow(keys); // Add headers to the worksheet

  // Add the rows of data
  jsonData.forEach((data: any) => {
    worksheet.addRow(Object.values(data)); // Add the row values
  });

  // Format number columns
  const numCols = [
    "Sub Total",
  ];
  worksheet.eachRow((row, rowNumber) => {
    numCols.forEach((col) => {
      const colIndex = keys.indexOf(col) + 1;
      const cell = row.getCell(colIndex);
      if (!isNaN(cell.value as any)) {
        cell.numFmt = "#,##0"; // Number format with thousand separators
      }
    });
  });

  // Format date columns
  const dateCols = ["Tanggal Awal", "Tanggal Akhir"];
  worksheet.eachRow((row, rowNumber) => {
    dateCols.forEach((col) => {
      const colIndex = keys.indexOf(col) + 1;
      const cell = row.getCell(colIndex);
      if (cell.value) {
        cell.numFmt = "d mmmm yyyy"; // Format as "5 January 2025"
      }
    });
  });

  // Calculate the total of the "Sub Total" column
  const subTotalColIndex = keys.indexOf("Sub Total") + 1;
  let totalSum = 0;

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // Skip the header row
      const subTotalCell = row.getCell(subTotalColIndex);
      if (!isNaN(subTotalCell.value as any)) {
        totalSum += Number(subTotalCell.value);
      }
    }
  });

  // Add a total row at the bottom
  const totalRow = worksheet.addRow([]);
  totalRow.getCell(1).value = "Total";
  totalRow.getCell(subTotalColIndex).value = totalSum;
  totalRow.getCell(subTotalColIndex).numFmt = "#,##0"; // Format total as number with thousand separators

  // Apply bold styling to the total row
  totalRow.font = { bold: true };

  // Apply borders to each cell, including the total row
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.border = {
        top: { style: "medium" as ExcelJS.BorderStyle },
        bottom: { style: "medium" as ExcelJS.BorderStyle },
        left: { style: "medium" as ExcelJS.BorderStyle },
        right: { style: "medium" as ExcelJS.BorderStyle },
      };
    });
  });

  // Create a Blob and use file-saver to download it in the browser
  const buffer = await workbook.xlsx.writeBuffer(); // Write workbook to buffer
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Use file-saver to save the file
  saveAs(blob, `${title}.xlsx`);
}

export default { exportToExcel, exportRekapToExcel };
