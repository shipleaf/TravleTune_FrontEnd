# 1️⃣ 프로젝트 소개
	TravelTune은 여행지 분위기에 기반한 음악을 추천하여 사용자의 여행 경험을 더욱 풍족하게 채울 수 있습니다.

# 2️⃣ 기획 배경 & 목표

우선, 두 페어의 공통 취미인 음악과 여행을 더욱 풍족하게 할 방법을 고민했고,
그 결과 여행지에서 분위기에 맞는 음악을 듣고 싶다는 공통적인 의견이 나왔고
서비스로 구현하기로 결정하였습니다.

# 3️⃣ 주요 기능

1. 여행지 기반 음악 추천
2. 여행 계획 작성
3. 사진으로 분위기에 맞는 노래 추천
4. 사용자 취향 수집

# 4️⃣ 서비스 화면 (UI / UX)

## 1. 로그인 페이지

TravelTune의 로그인 페이지는 간결함과 접근성을 중심으로 설계되었습니다.

<img width="1512" height="822" alt="login" src="https://github.com/user-attachments/assets/65890404-5e2e-435d-953a-4fd26a2e4e4b" />

⸻

## 2. 회원가입 페이지

회원가입은 단계형 프로세스로 구성되어 사용자 이탈을 최소화합니다.

최소한의 필수 정보만 먼저 입력받아 가입 진입 장벽을 낮췄습니다.


<img width="1512" height="818" alt="signup" src="https://github.com/user-attachments/assets/7fb86e38-be45-4da6-94e7-fc856eb370a3" />


⸻

## 3. 사용자 취향 수집 페이지

회원가입 이후, 개인화 추천을 위한 음악 취향 수집 단계가 진행됩니다.


수집된 취향 데이터는 TravelTune의 핵심 기능인
여행지 × 분위기 × 음악 추천 알고리즘의 기반 데이터로 사용됩니다.

<img width="1512" height="820" alt="signup-2" src="https://github.com/user-attachments/assets/4b9e3514-951d-4881-8c16-4feb95a3a1bf" />

⸻

## 4. 메인 페이지(지도 + 음악 추천)

- 홈페이지의 랜딩페이지인 메인페이지입니다. 관광지 추천, 여행 일정을 표시합니다.

메인페이지의 인트로뷰입니다
<div style="display: flex;">
  <img width="49%" height="814" alt="intro-1" src="https://github.com/user-attachments/assets/b69549aa-359f-48e6-975e-7e74cacdeeb6" />
  <img width="49%" height="815" alt="intro-2" src="https://github.com/user-attachments/assets/ef524f88-2bd9-4cfe-9d94-3ca3fba33f69" />
</div>

<br>

메인페이지는 화면 하단 플레이에 선택에 따라 4가지 무드로 표현될 수 있습니다. 무드를 선택하면 알맞는 음악이 재생되며, 
페이지의 분위기가 바뀝니다.
헤더 바의 버튼을 통해 스포티파이 로그인을 진행할 수 있습니다.

<div style="display: flex;">
  <img width="49%" height="820" alt="mood-1" src="https://github.com/user-attachments/assets/c0aef0de-366b-472a-87a6-247684956964" />
  <img width="49%" height="822" alt="mood-2" src="https://github.com/user-attachments/assets/95335711-2224-40f4-8e8a-bb30559d67d5" />
</div>
<div style="display: flex;">
  <img width="49%" height="819" alt="mood-3" src="https://github.com/user-attachments/assets/51ee493e-9a4f-431f-9859-dc142e3cd805" />
  <img width="49%" height="819" alt="mood-4" src="https://github.com/user-attachments/assets/296e4111-a152-4787-882a-d2cc2ff7e7b3" />
</div>
<img width="1512" height="283" alt="geo-attractions" src="https://github.com/user-attachments/assets/f8fe3029-eb51-4320-8f0b-b2ba857e4efa" />

<br>
<br>
메인페이지의 프롬프트 영역에서 사진과 프롬프트를 입력 후
사진의 분위기에 맞는 노래를 추천 받을 수 있습니다.

<br>

<div style="display: flex;">
  <img width="49%" height="821" alt="prompt-1" src="https://github.com/user-attachments/assets/7f70596d-e7ec-469e-adfe-3ed9407293df" />
  <img width="49%" height="822" alt="prompt-2" src="https://github.com/user-attachments/assets/3904e0c3-7803-4fa4-9d26-5e8520ee4627" />
</div>

## 5. 여행지 조회 페이지

- 여행지를 필터 기반, 검색어 기반으로 찾고, 알맞는 음악을 추천받을 수 있습니다.

<div style="display: flex;">
  <img width="49%" height="818" alt="search-attractions" src="https://github.com/user-attachments/assets/3945a231-a3ea-4cc0-ba28-e93f407c27c5" />
  <img width="49%" height="821" alt="filter" src="https://github.com/user-attachments/assets/d3989279-a04b-4bd2-96e3-dac5b48c1b5a" />
</div>

<br>
<br>
야행지 검색 결과입니다. 음악으로 떠나보기 버튼을 클릭해 음악 추천을 받을 수 있습니다.
<img width="1512" height="819" alt="search-result" src="https://github.com/user-attachments/assets/f89927bc-5462-4e4c-aa2f-5c1499779d1d" />

<br>
<br>

추천 결과입니다. 추천 결과를 앨범 이미지로 나열하고 클릭하면 LP판이 돌아가는 애니메이션과
함께 음악을 재생할 수 있습니다.
여행지 감성에 대한 사용자 UX를 고려하여 설계하였습니다.
<div style="display: flex;">
<img width="49%" height="819" alt="recommedation" src="https://github.com/user-attachments/assets/1b732d4e-f391-46e4-8ac0-793e91ba57ea" />
<img width="49%" height="816" alt="play-music" src="https://github.com/user-attachments/assets/8ccc33a1-438d-4047-a003-925c42d0352b" />
</div>

## 5. 여행 일정 페이지

- 존재하는 여행 일정을 보여주고 여행 추가를 할 수 있는 페이지입니다.

<img width="1512" height="820" alt="my-travel" src="https://github.com/user-attachments/assets/4da2a58c-3065-42c5-8d3d-c50b67fe56c0" />

<br>
<br>

새 여행 버튼을 통해 새로운 여행을 생성할 수 있습니다.
날짜 선택, 여행 지역 선택, 제목, 설명, 사진등을 추가할 수 있습니다.
<div style="display: flex;">
  <img width="24%" height="812" alt="new-trip-step-1" src="https://github.com/user-attachments/assets/810b6a3c-a165-439e-90bd-99d9d87f9b91" />
  <img width="24%" height="813" alt="new-trip-step-2" src="https://github.com/user-attachments/assets/a9aa3cf9-af21-41f1-9a41-4b832d56af44" />
  <img width="24%" height="771" alt="new-trip-step-3" src="https://github.com/user-attachments/assets/de1768a8-3577-44db-b023-fd4fed3a3aeb" />
  <img width="24%" height="772" alt="new-trip-step-4" src="https://github.com/user-attachments/assets/9d1a7fb2-3b2c-475b-9492-317e518a24bc" />
</div>

## 6. 상세 일정 페이지

- 여행에서 날짜별 일정을 작성하는 페이지입니다.

<img width="1512" height="821" alt="trip-detail-select" src="https://github.com/user-attachments/assets/93001802-fad3-4eb8-8d38-d0361eb8dfc4" />
