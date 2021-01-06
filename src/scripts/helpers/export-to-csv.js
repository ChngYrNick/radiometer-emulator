export function tableToCSV() {
  const tableHeaders = Array.from(document.querySelectorAll('th'))
    .map((item) => {
      // title = splits elem tags on '\n',
      // then filter out blank "" that appears in array.
      // ex ["Timestamp", "[Full time]", ""]
      const title = item.innerText
        .split('\n')
        .filter((str) => str !== 0)
        .join(' ');
      return title;
    })
    .join(',');

  const rows = Array.from(document.querySelectorAll('tr')).reduce((arr, currRow) => {
    // if tr tag contains th tag.
    // if null return array.
    if (currRow.querySelector('th')) return arr;

    // concats individual cells into csv format row.
    const cells = Array.from(currRow.querySelectorAll('td'))
      .map((item) => item.innerText)
      .join(',');
    return arr.concat([cells]);
  }, []);

  return `${tableHeaders}\n${rows.join('\n')}`;
}

export function downloadCSV(csv) {
  const csvFile = new Blob([csv], { type: 'text/csv' });
  const downloadLink = document.createElement('a');
  // sets the name for the download file
  downloadLink.download = 'spreadsheet.csv';
  // sets the url to the window URL created from csv file above
  downloadLink.href = window.URL.createObjectURL(csvFile);
  // creates link, but does not display it.
  downloadLink.style.display = 'none';
  // add link to body so click function below works
  document.body.appendChild(downloadLink);

  downloadLink.click();
}
