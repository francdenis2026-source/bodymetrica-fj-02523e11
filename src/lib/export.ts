
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export interface ExportFilter {
  type?: 'MEAL' | 'WATER' | 'ALL';
  startDate?: Date;
  endDate?: Date;
}

export const exportToCSV = (data: any[], filename: string, filter?: ExportFilter) => {
  let filteredData = [...data];
  
  if (filter) {
    if (filter.type && filter.type !== 'ALL') {
      filteredData = filteredData.filter(d => d.type === filter.type);
    }
    // Date filtering logic would go here if data has timestamps
  }

  if (filteredData.length === 0) return;

  const headers = Object.keys(filteredData[0]);
  const csvRows = [
    headers.join(','),
    ...filteredData.map(row => 
      headers.map(header => {
        const value = row[header];
        const escaped = ('' + value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: any[], filename: string, title: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(20, 20, 30);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(title.toUpperCase(), 15, 20);
  
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const body = data.map(row => Object.values(row));

    (doc as any).autoTable({
      startY: 40,
      head: [headers],
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [40, 100, 250] }
    });
  }

  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
