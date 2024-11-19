///////////                     ///////////
/////////// Fetching Doors!!!!! ///////////
///////////                     ///////////

const getSurveySheetData = async (baseUrl, gid, range) => {
  // Add range parameter to URL
  const url = `${baseUrl}?output=tsv&gid=${gid}&range=${encodeURIComponent(
    range
  )}`;
  const response = await fetch(url);
  const csvText = await response.text();

  // Handle empty response
  if (!csvText.trim()) {
    return [];
  }

  // Split into rows, handling both \r\n and \n
  const rows = csvText.split(/\r?\n/);

  // Filter out rows that are completely blank or contain only "-"
  const filteredRows = rows.filter((row) => {
    const cells = row.split('\t');
    return cells.some((cell) => cell.trim() && cell.trim() !== '-');
  });

  // Map filtered rows into arrays of cell values
  const data = filteredRows.map((row) => row.split('\t'));

  return data; // Return the processed data
};

const baseUrlTest =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVOQTKkl3AJ6ljHTaPQLwa501fBl9R6PBBXgYlh4NaQ1rW1WOpMhGydjfMRc4yKFRlK0IXOkLynrOG/pub';
const gid = '534084252'; // Ⅰ. 출입문 조사
const range = 'A6:O'; // 출입문 조사내용
