export function objectToCsv(data: any) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
  
    for (const row of data) {
      const values = headers.map(header => {
      const val = row[header]
      return `"${val}"`;
    });
  
    csvRows.push(values.join(','));
    }
  
    return csvRows.join('\n');
  }

  export default objectToCsv