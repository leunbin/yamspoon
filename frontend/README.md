# YAMSpoon
 YAMSpoon은 내 냉장고 속 재료들로 만들 수 있는 레시피들을 제공하는 서비스입니다.

<hr />

## 📍서비스 소개

YAMSpoon은 재료별, 종류별(양식, 한식, 중식 등) 레시피뿐만 아니라 나만의 냉장고 서비스를 제공합니다. 사용자는 자신의 냉장고 속 재료를 추가하여 해당 재료로 만들 수 있는 레시피를 찾을 수 있으며, 마이페이지에서는 저장하거나 작성한 레시피를 확인할 수 있습니다.


## 📍서비스 주요 기능

### 홈
- 배너 버튼 클릭 시 로그인 여부에 따라 나만의 냉장고/로그인 페이지로 이동
- 화제의 레시피 10개 리스트업
- 최근 레시피 10개 리스트업

### 레시피
- 레시피 재료별, 종류별 조회
- 레시피 상세 정보 조회
- 레시피 정렬 및 페이지네이션
- 레시피 등록 및 수정
- 레시피 좋아요 및 저장 
- 레시피 검색

### 나만의 냉장고
- 로그인한 유저가 저장한 재료 불러오기
- 재료 추가/삭제
- 재료 선택시 해당하는 레시피 불러오기

### 사용자 기능
- 로그인
- 회원가입 (아이디/닉네임 중복, 이메일 형식, 비밀번호 형식, 이메일 인증 체크)
- 아이디/비밀번호 찾기
- 비밀번호 찾기에서 이메일 인증 성공시 비밀번호 재설정

### 마이페이지
- 정보 수정
- 회원 탈퇴
- 사용자가 등록한 레시피 조회
- 사용자가 저장한 레시피 조회

  
## 📍기술 스택
#### Front End
<img src="https://shields.io/badge/react-black?logo=react&style=for-the-badge"/> 
<img src ="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" />
<img src="https://shields.io/badge/axios-671ddf?logo=axios&style=for-the-badge"/> 

#### Back End
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> 
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"/> 
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon%20S3-569A31?logo=amazons3&logoColor=fff&style=for-the-badge"/>

#### Deploy
<img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=NGINX&logoColor=white"/> 
<img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=PM2&logoColor=white"/> 


## 📍서비스 구성도

  - <a href="https://www.figma.com/file/Omc6RfrVc6zAiOwSL8Iif5?embed_host=notion&kind=file&mode=design&node-id=0%3A1&t=4QAk66G4NazUz4X0-1&type=design&viewer=1">와이어프레임</a> 
  - <a href="https://app.swaggerhub.com/apis/SILVERBIN2105_1/YAMSpoon/1.0.0">API 명세서</a>

## 📍실행 방법
```
//local에서 실행 시
git clone 

npm install
.env 파일 생성

npm start
```

#### 테스트 계정

| 아이디 | 비밀번호 |
| ------ | ------ |
| user123 | password397! |


#### 접속 주소
http://kdt-sw-8-team06.elicecoding.com:3001/


## 📍프로젝트 팀원 역할 분담
| 이름 | 담당 업무 |
| ------ | ------ |
| 양혜지 | 팀장 / 프론트엔드 개발 |
| 강경림 | 프론트엔드 개발 |
| 김송이 | 프론트엔드 개발 |
| 임채리 | 프론트엔드 개발 |
| 이은빈 | 백엔드 개발 |
| 한새환 | 백엔드 개발 |

**멤버별 responsibility**

1. 양혜지: 팀장/프론트엔드 담당

- 페이지: 종류별 레시피, 레시피 등록/수정
- 기능: 버튼 Carousel, 레시피 검색 구현
- 공통 컴포넌트: 헤더, 푸터

2. 강경림: 프론트엔드 담당

- 페이지: 마이페이지, 레시피 상세페이지
- 기능: 이미지 Carousel 기능 구현
- 공통 컴포넌트: 탑버튼, 로딩페이지, 모달창

3. 김송이: 프론트엔드 담당

- 페이지: 메인 홈, 재료별 레시피, 나만의 냉장고
- 공통 컴포넌트: 페이지네이션 기능

4. 임채리: 프론트엔드 담당

- 페이지: 로그인, 회원가입, 아이디/비밀번호 찾기
- 기능: axios api, 사용자 정보 형식 체크

5. 이은빈: 백엔드 담당

- user API: 사용자 정보 조회, 수정, 삭제, 작성 레시피 조회, 저장 레시피 조회, 저장 레시피 정보 수정, 아이디/비밀번호 찾기, 비밀번호 초기화, 사용자 냉장고 정보 조회/수정
- auth API: 회원가입, 로그인, 메일 인증 전송/확인, 아이디/닉네임 중복 확인

6. 한새환: 백엔드 담당

- recipe API: 레시피 조회, 생성, 수정, 삭제, 재료/카테고리/레시피 아이디로 조회, 인기/최신순 정렬, 좋아요 수 수정
- ingredients API: 재료 카테고리 조회, 카테고리 아이디로 재료 조회

