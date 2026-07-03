const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const headers = ['Hari', 'Jam', 'Mata Praktikum', 'Ruang', 'PJ', 'Tutor'];
const data = [
    ['Senin', '10:00 - 12:00', 'Algoritma Pemrograman', 'Lab J5', 'Budi', 'Andi, Ani'],
    ['Selasa', '13:00 - 15:00', 'Pemrograman Web', 'Lab J5', 'Chandra', 'Dewi, Dodi'],
];

const worksheetData = [headers, ...data];
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
XLSX.utils.book_append_sheet(workbook, worksheet, 'Schedule');

const outputPath = path.join(__dirname, 'dummy_schedule.xlsx');
XLSX.writeFile(workbook, outputPath);
console.log('Created dummy Excel file at:', outputPath);
