// // 카카오 맵 API를 호출하는 예제
// const axios = require("axios");

// async function getCoordinates(address) {
//   const response = await axios.get(
//     "https://dapi.kakao.com/v2/local/search/address.json",
//     {
//       params: {
//         query: address,
//       },
//       headers: {
//         Authorization: `f03578631d985805a0ef05b3a5a83242`, // 여기에 발급받은 REST API 키를 입력하세요.
//       },
//     }
//   );

//   const data = response.data.documents[0];
//   if (data) {
//     console.log(data);
//     return {
//       latitude: data.y,
//       longitude: data.x,
//     };
//   } else {
//     throw new Error("Address not found");
//   }
// }

// // 사용 예
// getCoordinates("광주광역시 동구 중앙로 196")
//   .then((coords) => {
//     console.log(`Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// let mapContainer = document.getElementById("map");
// let mapOption = {
//   center: new kakao.maps.LatLng(33.450701, 126.570667),
//   level: 3,
// };

// // 지도를 생성합니다
// let map = new kakao.maps.Map(mapContainer, mapOption);

// // 주소-좌표 변환 객체를 생성합니다
// let geocoder = new kakao.maps.services.Geocoder();

// // 주소로 좌표를 검색합니다
// geocoder.addressSearch("광주광역시 중앙로 196", function (result, status) {
//   // 정상적으로 검색이 완료됐으면
//   if (status === kakao.maps.services.Status.OK) {
//     var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

//     // 결과값으로 받은 위치를 마커로 표시합니다
//     var marker = new kakao.maps.Marker({
//       map: map,
//       position: coords,
//     });

//     // 인포윈도우로 장소에 대한 설명을 표시합니다
//     var infowindow = new kakao.maps.InfoWindow({
//       content:
//         '<div style="width:150px;text-align:center;padding:6px 0;">SMHRD</div>',
//     });
//     infowindow.open(map, marker);

//     // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
//     map.setCenter(coords);
//   }
// });
