///////////               ///////////
/////////// Fetching!!!!! ///////////
///////////               ///////////
const getSheetData = async () => {
  const url =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQzxmSMEHHgSdJ5p4igiBToAy5PzdkAj9q_IwnzqkkzPMmZDTXfmpBaTpYRUbzR1Kzxh79greDeyR0i/pub?gid=180516084&single=true&output=csv';

  try {
    const response = await fetch(url);
    const csvText = await response.text();

    // Parse CSV to JSON
    const rows = csvText.split('\n').map((row) => row.split(','));
    const headers = rows[0]; // First row is headers
    const data = rows
      .slice(1)
      .map((row) =>
        Object.fromEntries(row.map((cell, i) => [headers[i], cell]))
      );

    return data;
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
  }
};

getSheetData()
  .then((buildings) => {
    const validBuildings = [];
    for (let i = 0; i < buildings.length; i++) {
      const row = buildings[i];
      // Check if the address is valid (non-empty and non-null)
      if (row['Link'] && row['Link'].trim() !== '') {
        validBuildings.push(row);
      }
    }
    console.log(validBuildings);

    const positions = [];
    for (let i = 0; i < validBuildings.length; i++) {
      positions.push({
        title: validBuildings[i]['건물명'],
        content: validBuildings[i]['Link'],
        latlng: new kakao.maps.LatLng(
          validBuildings[i]['위도'],
          validBuildings[i]['경도']
        ),
      });
    }
    console.log(positions);

    // 지도 위에 마커를 표시합니다
    for (var i = 0; i < positions.length; i++) {
      // 마커를 생성하고 지도위에 표시합니다
      addMarker(positions[i]);
    }
    return positions;
  })
  ///////////                     ///////////
  /////////// Fetching Doors!!!!! ///////////
  ///////////                     ///////////
  .then((sheet) => {
    for (let i = 0; i < sheet.length; i++) {
      const doorLink = sheet[i]['content'];
      const doorBaseUrl = doorLink.slice(0, -4); // 뒤에 html 제거. 최종 pub으로 끝남
      const doorPositions = [];
      getSurveySheetData(doorBaseUrl, gid, range)
        .then((doors) => {
          console.log(doors);

          for (let j = 0; j < doors.length; j++) {
            if (doors[j][5]) {
              doorPositions.push({
                doorBuilding: doors[j][1],
                doorName: doors[j][4],
                doorBBF: doors[j][14],
                doorType: doors[j][13],
                latlng: new kakao.maps.LatLng(doors[j][5], doors[j][6]),
              });
            }
          }
        })
        .then(() => {
          ///////////                     ///////////
          ///////////  Door markers!!!!!  ///////////
          ///////////                     ///////////
          for (let h = 0; h < doorPositions.length; h++) {
            addDoorMarker(doorPositions[h]);
          }
        });
    }
  });

const type1Markers = []; // Store markers of type 1
const type2Markers = []; // Store markers of type 2

function toggleMarkers(markers, isVisible) {
  markers.forEach((marker) => marker.setMap(isVisible ? map : null));
}

// Event listeners for legend checkboxes
document.getElementById('type1').addEventListener('change', (e) => {
  toggleMarkers(type1Markers, e.target.checked);
});

document.getElementById('type2').addEventListener('change', (e) => {
  toggleMarkers(type2Markers, e.target.checked);
});
