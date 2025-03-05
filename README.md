# 간단한 게시판 사이트
백엔드 실습용으로 만든 게시판 사이트입니다.
무료 서버를 사용하고 있어서 특히 첫 로딩 시 속도가 느릴 수 있습니다. 조금만 기다려주시면 감사하겠습니다.
## 사용 기술
프론트엔드 - html, css, javascript<br>
벡엔드 - express, postgresql
## 기능 소개
* **회원제 기능**<br>
  회원가입/로그인/로그아웃 기능이 구현되어 있으며, 로그인 시에만 게시글을 열람/작성/수정할 수 있습니다.<br>
  비밀번호는 bcrypt로 암호화되어 안전하게 저장됩니다.<br>
  ![image](https://github.com/user-attachments/assets/17ea66cf-d3c8-4c42-bd39-437cc62d8f5f)
  (로그인 되지 않은 상태에서 게시글 열람 시 로그인 창이 뜨는 모습)<br>
  ![image](https://github.com/user-attachments/assets/602bcd37-480a-49a2-a098-bf78935281ed)
  로그인 상태에서 유저명을 클릭할 시 뜨는 회원정보 탭에서 유저명 수정과 회원 등급 확인이 가능합니다.<br>
  회원 등급은 어드민 회원과 일반 회원으로 구분되어 있으며, 어드민 유저는 모든 글과 댓글을 수정/삭제할 수 있습니다.
* **게시글 CRUD**<br>
![image](https://github.com/user-attachments/assets/85911c14-8a4c-4a24-bc0a-18e4554602cb)
(게시글 페이지의 모습)<br>
![image](https://github.com/user-attachments/assets/1992e4f2-10ce-41d6-942c-cf4416813e50)
(게시글 수정 페이지의 모습)<br>
글쓰기/검색/수정/삭제 기능이 구현되어 있습니다.<br>
어드민이 아닌 유저는 본인의 글만 수정/삭제할 수 있습니다.<br>
게시글에는 제목, 텍스트, 이미지(10개까지)가 포함될 수 있습니다.<br>
게시글 수정 시 이미지도 수정할 수 있습니다.<br>
![image](https://github.com/user-attachments/assets/25366ed0-af36-4314-9bc0-196566256318)
(게시글 검색시의 모습)<br>
상단의 검색 탭에서 제목+내용, 제목, 내용, 작성자 4가지 기준으로 게시글을 검색할 수 있습니다.<br>

* **각종 오류 처리**<br>
  사이트 이용시 발생할 수 있는 각종 오류들을 최대한 잡았습니다.<br>
  * **회원가입/로그인/회원정보 수정 시**<br>
  ![image](https://github.com/user-attachments/assets/00223136-bed8-492a-a9fb-ee031d84298f)
  (회원가입 시 뜨는 오류 문구 예시)<br>
  회원가입과 회원정보 수정 시 이미 존재하는 유저명을 사용할 수 없습니다.<br>
  유저명은 10자까지만 입력할 수 있도록 제한되어 있으며, 비어있을 수 없습니다.<br>
  * **게시글 작성/수정 시**<br>
  ![image](https://github.com/user-attachments/assets/01168713-ff2b-4571-919b-81481a9c2f88)
  (게시글 오류 창의 예시)<br>
  게시글의 제목이나 내용이 비어있거나, 이미지를 10장 넘게 첨부했을 시 오류 창이 뜹니다.<br>
