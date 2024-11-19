var mapContainer = document.getElementById('map'), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.459975, 126.954841), // 지도의 중심좌표
    level: 2, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

const openPopup = (iframeText) => {
  // JavaScript to handle the popup
  const popup = document.getElementById('popup');
  const popupOverlay = document.getElementById('popupOverlay');
  const closePopupButton = document.getElementById('closePopup');
  const iframe = document.getElementById('popupIframe');

  // Open popup
  iframe.src = iframeText; // Set your iframe URL here
  popup.style.display = 'block';
  popupOverlay.style.display = 'block';

  // Close popup
  const closePopup = () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
    iframe.src = ''; // Clear iframe source to stop loading
  };

  // Close popup on clicking the close button
  closePopupButton.addEventListener('click', closePopup);

  // Close popup on clicking the overlay
  popupOverlay.addEventListener('click', closePopup);

  // Prevent closing popup when clicking inside the popup
  popup.addEventListener('click', (event) => {
    event.stopPropagation();
  });
};

var selectedMarker = null; // 클릭한 마커를 담을 변수

// 마커를 생성하고 지도 위에 표시하고, 마커에 mouseover, mouseout, click 이벤트를 등록하는 함수입니다
function addMarker(position) {
  // 마커를 생성하고 이미지는 기본 마커 이미지를 사용합니다
  var marker = new kakao.maps.Marker({
    map: map,
    position: position.latlng,
    title: position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
    clickable: true,
  });

  marker.setMap(map);
  type1Markers.push(marker);

  kakao.maps.event.addListener(marker, 'click', makeOverListener());

  // 구글 시트 팝업을 표시하는 함수
  function makeOverListener() {
    return function () {
      openPopup(position.content);
    };
  }
}

function addDoorMarker(doorPosition) {
  // 마커를 생성하고 이미지는 기본 마커 이미지를 사용합니다

  const doorImageSize = new kakao.maps.Size(30, 30);
  let doorMarkerImage;
  if (doorPosition.doorBBF !== 'BBF 충족') {
    doorMarkerImage = new kakao.maps.MarkerImage(
      doorImageSrcRed,
      doorImageSize
    );
  } else if (
    doorPosition.doorType === '자동문' ||
    doorPosition.doorType === '오픈'
  ) {
    doorMarkerImage = new kakao.maps.MarkerImage(
      doorImageSrcGreen,
      doorImageSize
    );
  } else {
    doorMarkerImage = new kakao.maps.MarkerImage(
      doorImageSrcBlue,
      doorImageSize
    );
  }

  var marker = new kakao.maps.Marker({
    map: map,
    position: doorPosition.latlng,
    title: doorPosition.doorName,
    clickable: true,
    image: doorMarkerImage,
  });

  marker.setMap(map);
  type2Markers.push(marker);

  // console.log(doorPosition.latlng);

  // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
  var iwContent = `  <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.5; margin: 10px 15px;">
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px 10px; font-weight: bold; border-bottom: 1px solid #ddd;">출입문 위치</td>
      <td style="padding: 8px 10px; font-weight: bold; border-bottom: 1px solid #ddd;">${
        doorPosition.doorName
      }</td>
    </tr>
    <tr>
      <td style="padding: 8px 10px; font-weight: bold; border-bottom: 1px solid #ddd;">BBF 여부</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #ddd; color: ${
        doorPosition.doorBBF === 'BBF 충족' ? 'green' : 'red'
      };">
        ${doorPosition.doorBBF}
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 10px; font-weight: bold;">출입문 유형</td>
      <td style="padding: 8px 10px; color: ${
        doorPosition.doorType === '자동문' || doorPosition.doorType === '오픈'
          ? 'green'
          : 'black'
      };">${doorPosition.doorType}</td>
    </tr>
  </table>
</div>
  `, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemoveable,
  });

  // 마커에 클릭이벤트를 등록합니다
  kakao.maps.event.addListener(marker, 'click', function () {
    // 마커 위에 인포윈도우를 표시합니다
    infowindow.open(map, marker);
  });
}

const doorImageSrcGreen =
  'https://cdn3.iconfinder.com/data/icons/web-ui-color/128/Marker_green-256.png';
const doorImageSrcBlue =
  'https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Marker-256.png';
const doorImageSrcRed =
  'https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Marker_red-256.png';
