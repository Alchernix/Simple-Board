# 간단한 게시판 사이트
백엔드 실습용으로 만든 게시판 사이트입니다.
무료 서버를 사용하고 있어서 특히 첫 로딩 시 속도가 느릴 수 있습니다. 조금만 기다려주시면 감사하겠습니다.
## 프로젝트 소개
* **개발 기간**<br>
  2025/2/25 ~ 2025/3/5
* **개발한 사람**<br>
  1인 개발
* **사용 기술**<br>
프론트엔드 - html, css, javascript<br>
벡엔드 - express, postgresql
## 기능 소개
* **기본 UI**<br>
![image](https://github.com/user-attachments/assets/4df12815-be33-4278-ab1f-c01063280161)
이름 클릭 시 회원정보 확인과 로그아웃이 가능합니다.<br>
편의성 기능으로 게시판 로고를 클릭시 메인 화면으로 돌아갑니다.<br>
미디어쿼리를 사용해서 모바일과 PC에서 UI가 조금 다릅니다. 이 리드미의 UI는 PC를 기준으로 작성되었습니다.<br>
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
메인 화면에서 게시글 제목 뒤의 이미지 아이콘으로 이미지가 포함된 게시글을 식별할 수 있습니다.<br>
게시글 수정 시 이미지도 수정할 수 있습니다.<br>
![image](https://github.com/user-attachments/assets/25366ed0-af36-4314-9bc0-196566256318)
(게시글 검색시의 모습)<br>
상단의 검색 탭에서 제목+내용, 제목, 내용, 작성자 4가지 기준으로 게시글을 검색할 수 있습니다.<br>
* **댓글/대댓글**<br>
![image](https://github.com/user-attachments/assets/f998a877-185c-446b-b6a0-9d757eed8191)
댓글과 대댓글을 작성할 수 있고 삭제할 수 있습니다.<br>
어드민이 아닌 유저는 본인의 댓글/대댓글만 삭제할 수 있습니다.<br>
댓글 삭제시, 대댓글이 없는 댓글이나 대댓글은 바로 삭제되며, 대댓글이 있는 댓글의 경우 대댓글은 남아 있습니다.<br>
메인 화면에서 게시글의 댓글 수를 확인할 수 있습니다.<br>
* **하트**<br>
게시글에 하트를 누를 수 있습니다.<br>
하트는 게시글 당 하나만 누를 수 있으며, 다시 누를 시 취소됩니다.<br>
메인 화면과 게시글의 하트 버튼 밑 숫자에서 게시글의 하트 수를 확인할 수 있습니다.<br>
* **알림**<br>
![image](https://github.com/user-attachments/assets/370d621c-7eb1-4723-82d6-e67af03a1437)
하트, 댓글, 대댓글 알림이 구현되어 있습니다.<br>
화면 상단에서 읽지 않은 알림의 수를 확인할 수 있습니다.<br>
알림을 클릭해서 알림이 온 글로 이동할 수 있으며, 읽은 알림은 색깔로 구분할 수 있습니다.<br>
모두 읽기 버튼으로 알림을 전부 읽을 수 있으며, 알림 삭제 버튼으로 알림을 전부 삭제할 수 있습니다.<br>
* **페이징**<br>
페이징 기능이 구현되어 있습니다.<br>
메인 화면과 검색 결과에 적용됩니다.<br>
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
  * **에러 페이지**<br>
  서버에서 에러가 발생했을 때는 에러 페이지로 이동합니다.<br>
  * **404 페이지**<br>
  404 에러는 별도로 표시됩니다.<br>
## 테이블 구조
![image](https://github.com/user-attachments/assets/49d44263-413d-49f5-9fca-7cae7e9e76ed)

## 트러블슈팅
* **이미지 저장 방식 변경**<br>
  처음에는 업로드된 이미지를 uploads 폴더에 저장하도록 구현했습니다. ( ``` const upload = multer({ dest: './uploads/' });```) 그런데 Render을 이용해서 배포하려고 보니, Render에서는 서버가 재시작될 때마다 uploads 폴더의 파일이 사라져서 이 방식을 쓸 수 없다는 것을 알게 되었습니다. 그래서 cloudinary를 활용해서 이미지를 클라우드에 저장하는 방식으로 번경했습니다. cloudinary를 사용하니 배포 환경에서도 이미지가 정상적으로 유지되었습니다.
* **댓글/하트 구현 방식 변경**<br>
  처음에는 댓글을 작성하거나 하트를 누를 때 페이지를 새로고침(``` res.render('post', { post, comments, likeCount }); ```)하면서 변경된 데이터를 다시 렌더링하도록 구현했습니다. 그러나 사이트를 이용하다 보니 특히 댓글이 많아질 때 댓글을 달 때마다 새로고침이 되는 것이 불편하다고 느껴졌습니다. 다른 커뮤니티 사이트에서는 이런 일이 일어나지 않아서 어떻게 구현했나 알아봤더니 프론트엔드에서 fetch나 axios로 비동기 요청을 보내고 댓글을 받아와서 페이지 일부만 업데이트 하는 방식으로 구현한다는 걸 알게 되었습니다. res.json으로 댓글을 보내고 fetch로 받아오는 방식으로 수정하니 사용자 경험이 더 좋아진 걸 느꼈습니다. 백엔드 개발이 이번이 처음이었는데 이 경험으로 AJAX를 사용하는 법을 배웠습니다.
