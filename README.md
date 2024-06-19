# 1. 개요

해당 프로젝트의 웹은 React와 FastAPI로 개발되었으며 각각의 git repository가 있습니다. 모델 파일은 FastAPI가 있는 git repository에 같이 있습니다.
git repository 주소:

- 프론트: https://github.com/leh60245/react-cloud
- 백: https://github.com/leh60245/fastapi

## 설치

프론트 프로그램을 사용하려면 우선 의존성 모듈을 설치해야 합니다.

```bash
yarn
or
yarn install
```

## 실행

프론트 프로그램을 실행하는 방법입니다.

```bash
npm start
```

백 프로그램을 실행하는 방법입니다.

```bash
uvicorn main:app --reload
```

## 화면 구성

화면은 크게 4가지로 “첫 화면”, “오늘의 운동 화면”, “개인 설정 화면”, “사용 설명서 화면” 입니다.

- 첫 화면: 프로그램이 시작되면 가장 먼저 보이는 화면으로 “오늘의 운동 시작”, “개인 설정”, “사용 설명서” 3개의 버튼이 있습니다. 각 버튼을 누르면 해당 화면으로 전환이 됩니다.
- 오늘의 운동 화면: 첫 화면에서 보이는 “오늘의 운동 시작” 버튼을 누르면 나오는 화면으로 운동 자세 피드백을 음성으로 받을 수 있습니다. 화면의 구성은 좌측, 중앙, 우측으로 나누어지며 좌측에는 카메라가 신체를 인식하는 정도를 0~100% 사이의 수치로 알려줍니다. 중앙에는 카메라로 찍히는 사용자의 모습을 보여줍니다. 우측에는 진행된 단계를 보여줍니다.
- 개인 설정 화면: 첫 화면에서 보이는 “개인 설정” 버튼을 누르면 나오는 화면으로 프로그램의 배경색을 변경할 수 있습니다.
- 사용 설명서 화면: 첫 화면에서 보이는 “사용 설명서” 버튼을 누르면 나오는 화면으로 처음 프로그램을 사용하는 사용자를 위한 설명서로 제작 예정입니다. 설명할 내용은 “오늘의 운동 시작” 페이지의 화면 구성입니다.

# 2. 코드 리뷰
웹 화면을 구성하는 파일과 데이터는 모두 src 폴더 내부에 있습니다.

App.js: “첫 화면”, 즉 웹 앱의 메뉴를 구성하는  js 파일입니다. 메뉴의 아이콘,종류,구성 요소를 변경,추가,삭제하고자 하거나 메뉴의 음성 안내 과정에서 바꿀 것이 있다면 해당 파일을 수정하면 됩니다.

routes 폴더: 버튼을 눌렀을 때 나오는 화면과 json 형식의 데이터가 있습니다.
- exercise.jsx: “오늘의 운동 화면”을 구성합니다.
- setting.jsx: “개인 설정 화면”을 구성합니다.
- instruction.js: “사용 설명서 화면”을 구성합니다.
- during_exercise.json: 운동을 시작하고 스텝별로 안내드릴 내용과 그 밖의 상황이 일어났을 때 안내드릴 내용이 텍스트 형식으로 저장돼 있습니다.
- keypoints_korea_name.json: MoveNet이 검출하는 keypoints와 대응되는 한국 이름이 저장돼 있습니다.

utils 폴더: 화면을 구성하는데 필요한 여러 함수들을 모아둡니다.
- getSpeech.jsx: 음성 안내에 필요한 함수가 있습니다.

# 3. 추가적인 내용
'기술문서.pdf'를 보시면 됩니다.
```
voice-home-training-front
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ config
│  ├─ description
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ objects
│  │  ├─ 02
│  │  │  ├─ 0c09212c252ea563d4e268e7b2e8cea98942b2
│  │  │  └─ 3af85899d0760bcc99d7fe85a667013096d3f4
│  │  ├─ 05
│  │  │  └─ 28e2cebc882228d6bc73ec18f1c117c5ada043
│  │  ├─ 0b
│  │  │  ├─ 1ab700941cd28d50b1ba8dc7744129c6849a9f
│  │  │  └─ afc002948232355127cf085f92fb0c07d068b6
│  │  ├─ 14
│  │  │  ├─ 35f401a4f1c068c0e8d2766528b3a3453d8a68
│  │  │  ├─ 99bccb0bee8b01dc71aa7e88fdad5364ead1c8
│  │  │  ├─ b5d5156dacf0f682bdbce8af6e05cd3ec0a04b
│  │  │  └─ d5ff207af730598dc3b4be090ff1877dbc06b2
│  │  ├─ 19
│  │  │  └─ 40d1f8002f588176377b306657e3f2b734689c
│  │  ├─ 1b
│  │  │  └─ 807269856321ff618a22f42d6ae6cc8853f19c
│  │  ├─ 21
│  │  │  ├─ 9da84df94852a000606668c5c06e4f95b744b7
│  │  │  └─ d325f5e4a6ed9f752b0744624574461a4ec426
│  │  ├─ 22
│  │  │  └─ d41a10226e6a74daadea57ad39c45165b8db99
│  │  ├─ 24
│  │  │  └─ 2a3d6755d2c71a3b45eda42fc98e3e3b6676a8
│  │  ├─ 25
│  │  │  ├─ 4feec4032918e58438835cf4dbb41600c911c8
│  │  │  └─ 6540f42bb51ff2188200871c2bfa80c0613841
│  │  ├─ 27
│  │  │  └─ 0c3dd2a861f5a130f408b52dd5b079a422dbfe
│  │  ├─ 2f
│  │  │  └─ 039beb2a2a7315c70c3ca3c2d96a37d8ce46bd
│  │  ├─ 34
│  │  │  └─ 0e3f7e0b0449b0ac8abd654522694c7ec1450d
│  │  ├─ 36
│  │  │  └─ 93353f1e8963c813e3535b5684ea439fc3a44e
│  │  ├─ 3c
│  │  │  └─ a4be0a961f6d4f319bcbbf6a72d89825b07e7a
│  │  ├─ 40
│  │  │  └─ 4e7271be5d3aaed6334dcd76cb6bee90238a58
│  │  ├─ 41
│  │  │  ├─ 50c2c3f913d51daccea10598e70262f5832e69
│  │  │  └─ 5b1a9440ee93895fb47b0f7c5d9a4d723cbdd7
│  │  ├─ 45
│  │  │  └─ ba63be4fc15a7b75002b7d3535d5212e5b8a4d
│  │  ├─ 46
│  │  │  └─ cca88a41fa2c61aba64264920d1a07e30c434b
│  │  ├─ 47
│  │  │  └─ 46951bde2ae1514f73fae32dc25ec6e16b93ee
│  │  ├─ 4c
│  │  │  └─ 58fcc498fc94da1991bc62bcd1ac244af1500d
│  │  ├─ 4d
│  │  │  └─ 8529216bb1badab7a98e83be89e45a2a679908
│  │  ├─ 4e
│  │  │  └─ 1a40a84e4bcda5451be968d42ad9155ac2beca
│  │  ├─ 51
│  │  │  └─ b30c1b7de828fe046a25dec79fc83499b2c326
│  │  ├─ 54
│  │  │  └─ 41959a31c252b7d314e39fa496701b5c3cbe9b
│  │  ├─ 56
│  │  │  └─ ffdbde0cf8858a3f63e2bbb3e26e340de6818e
│  │  ├─ 5c
│  │  │  └─ 574a5b006d59b025c8f5bb11fec6eedbe7a4c4
│  │  ├─ 63
│  │  │  └─ b803bcb0d60bef9f6ab20e91fa390928709c9e
│  │  ├─ 65
│  │  │  └─ df6491d4a0fe1572fd9e290d7b7d95a1b5a744
│  │  ├─ 67
│  │  │  └─ 5bfeded45fa95d5c7bf330dece7f420caf1085
│  │  ├─ 68
│  │  │  └─ 3300ecc7a347629f78da64e981aeb612c82412
│  │  ├─ 69
│  │  │  ├─ 30e22e362e9293670ef8bf6e8724f004e83025
│  │  │  └─ 42275eaaaca8984bc4c39e0e64012d81b5f706
│  │  ├─ 6a
│  │  │  └─ c68145aca9d22a5b3384b731b5a9ef0ec5c9b2
│  │  ├─ 6b
│  │  │  └─ 7af08e7dfaeb8ec422f6f8e26054aeee4b2dcb
│  │  ├─ 70
│  │  │  └─ 2355043b6cdfe95dbfc5ef15c5634b16532539
│  │  ├─ 72
│  │  │  └─ e8e995c4d3fd7f7aea9257b82f02be89f8f542
│  │  ├─ 73
│  │  │  └─ c9324b71745d5c75850a9aa64d2cd6d0a6a213
│  │  ├─ 74
│  │  │  └─ 0bacdf4bccad91fc4d0b0ba6fbb5d3c230b2a9
│  │  ├─ 75
│  │  │  └─ 68630a544bf6c795975ac122e14a221bb5ddea
│  │  ├─ 76
│  │  │  └─ 7275ff6b5f4c60d3f087bf3114552473aa40d3
│  │  ├─ 81
│  │  │  ├─ 06475fe8478e6dcf9524c68a44288330adaf1f
│  │  │  └─ 1cb9c770eac8f2c1bdcc29e13ed47d772c816b
│  │  ├─ 82
│  │  │  └─ f9679d0a302b1c86e3d9f53a2296848418829b
│  │  ├─ 83
│  │  │  └─ bf1bbe3990b8e4811fe7b66a78651db1331691
│  │  ├─ 84
│  │  │  └─ d2d56450bc0cf869b0ab2acc32c1ee69fd07b4
│  │  ├─ 8a
│  │  │  ├─ 0b668275123ebcd531e25ece9c61bb21d9f185
│  │  │  └─ 4ede7ae70b69542482a4013dc1eb4b282ce17f
│  │  ├─ 8d
│  │  │  └─ 55dc27370f81bebefd10cded0cdb469b752f89
│  │  ├─ 92
│  │  │  └─ 6b890e6368acd536f2ff82a53a4639499e44cb
│  │  ├─ 93
│  │  │  └─ 96bb9de8c3bb5904961362080a0293062ad0d2
│  │  ├─ 94
│  │  │  └─ 6606e8dff2aeb293ad7e1e135ac24a9fb12542
│  │  ├─ 95
│  │  │  └─ d6d17b6eecb363bcd9b9e5866e99eda8111901
│  │  ├─ 97
│  │  │  └─ c6742b2b24fc0ac6cec992f30f12a1f17502f1
│  │  ├─ 98
│  │  │  └─ d237e6999a85e2e3e2d2ed0eca70abdf76755b
│  │  ├─ 9d
│  │  │  └─ 31ecf6ab1070a17267640ec0fca8a75f27ebc2
│  │  ├─ a0
│  │  │  └─ 24766613317820db1657fa7e3e7d84f4567d8f
│  │  ├─ a5
│  │  │  └─ 2e042a6eb4bda8135ab653490eaad1d008577c
│  │  ├─ ad
│  │  │  └─ a7c1b28e150b9d930950b99b146dd386e6c559
│  │  ├─ b2
│  │  │  └─ cd0dccf739e8ba0f98fcc64671d6ac19df3d45
│  │  ├─ b4
│  │  │  └─ c0b0b6c7e034db52e01b495caecd867710666e
│  │  ├─ bb
│  │  │  └─ b5f95740609d33180bcebb48201f4468630fa4
│  │  ├─ be
│  │  │  ├─ 621a35614f34c9f1620dc0013f2fd50a2c2b87
│  │  │  └─ f4b7932b2661c8cfbb43c98b64ec79bfa5f01e
│  │  ├─ c1
│  │  │  └─ 71e2df54a7c23b54100c7101a1ab70dd9e669d
│  │  ├─ c5
│  │  │  └─ 016b77f43722c5e66f66668bb3ff76b09a8180
│  │  ├─ cc
│  │  │  └─ e33983de55631c0220862ac44bcc8ff0f29dff
│  │  ├─ cd
│  │  │  └─ ef0a513a15b79120af5c421becb9b9854d4c8c
│  │  ├─ d6
│  │  │  ├─ 81609557ffbceae688375d58d7bc3923b0e7a1
│  │  │  └─ 84aa60beae0466a76d67c2b0ed4890a5d5c28d
│  │  ├─ da
│  │  │  └─ 1665466da9474f0f450a876781aa5092f5d2ea
│  │  ├─ db
│  │  │  └─ 76180c787e7073f2bc5864184d19e97dc3e977
│  │  ├─ e0
│  │  │  └─ 616da143e6203d8368149fcdbd47e1db11b065
│  │  ├─ e3
│  │  │  └─ d44c2e3cf12974dc0a26f99b3773a81ea93cf5
│  │  ├─ e6
│  │  │  └─ 070acb56e0557ddcf696c451dad750c178a44e
│  │  ├─ fb
│  │  │  └─ fe6e9df611992485b4b42ed19d0519a02345f8
│  │  ├─ fe
│  │  │  └─ 3315166a56b74db7bf68b65cd2dc58c6a7ff6f
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-222fcc66744c7906d72f925b6db7fba2a2adf246.idx
│  │     ├─ pack-222fcc66744c7906d72f925b6db7fba2a2adf246.pack
│  │     └─ pack-222fcc66744c7906d72f925b6db7fba2a2adf246.rev
│  ├─ ORIG_HEAD
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     ├─ HEAD
│     │     └─ main
│     └─ tags
├─ .gitignore
├─ alembic.ini
├─ LICENSE
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.ico
│  ├─ images
│  │  ├─ Dial.psd
│  │  ├─ Dial1_0.png
│  │  ├─ Dial1_1.png
│  │  ├─ Dial1_2.png
│  │  ├─ Dial1_3.png
│  │  ├─ Dial1_4.png
│  │  ├─ Dial1_5.png
│  │  ├─ Dial1_6.png
│  │  ├─ Dial1_7.png
│  │  ├─ Dial2_0.png
│  │  ├─ Dial2_1.png
│  │  ├─ Dial2_2.png
│  │  ├─ Dial2_3.png
│  │  ├─ Dial2_4.png
│  │  ├─ Dial2_5.png
│  │  ├─ Dial2_6.png
│  │  ├─ Dial2_7.png
│  │  ├─ Dial3_0.png
│  │  ├─ Dial3_1.png
│  │  ├─ Dial3_2.png
│  │  ├─ Dial3_3.png
│  │  ├─ Dial3_4.png
│  │  ├─ Dial3_5.png
│  │  ├─ Dial3_6.png
│  │  ├─ Dial3_7.png
│  │  ├─ Dial4_0.png
│  │  ├─ Dial4_1.png
│  │  ├─ Dial4_2.png
│  │  ├─ Dial4_3.png
│  │  ├─ Dial4_4.png
│  │  ├─ Dial4_5.png
│  │  ├─ Dial4_6.png
│  │  ├─ Dial4_7.png
│  │  ├─ Online_0.png
│  │  ├─ Online_1.png
│  │  ├─ Online_2.png
│  │  ├─ Online_3.png
│  │  ├─ Online_4.png
│  │  ├─ Online_5.png
│  │  ├─ Online_6.png
│  │  └─ Online_7.png
│  ├─ index.html
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ manifest.json
│  └─ robots.txt
├─ README.md
├─ readme2.md
├─ src
│  ├─ App.css
│  ├─ App.js
│  ├─ App.test.js
│  ├─ index.css
│  ├─ index.js
│  ├─ lib
│  │  └─ api.jsx
│  ├─ logo.svg
│  ├─ reportWebVitals.js
│  ├─ setupTests.js
│  ├─ src
│  │  ├─ bar.png
│  │  ├─ BPL.png
│  │  ├─ Dial
│  │  │  ├─ Dial.psd
│  │  │  ├─ Dial1_0.png
│  │  │  ├─ Dial1_1.png
│  │  │  ├─ Dial1_2.png
│  │  │  ├─ Dial1_3.png
│  │  │  ├─ Dial1_4.png
│  │  │  ├─ Dial1_5.png
│  │  │  ├─ Dial1_6.png
│  │  │  ├─ Dial1_7.png
│  │  │  ├─ Dial2_0.png
│  │  │  ├─ Dial2_1.png
│  │  │  ├─ Dial2_2.png
│  │  │  ├─ Dial2_3.png
│  │  │  ├─ Dial2_4.png
│  │  │  ├─ Dial2_5.png
│  │  │  ├─ Dial2_6.png
│  │  │  ├─ Dial2_7.png
│  │  │  ├─ Dial3_0.png
│  │  │  ├─ Dial3_1.png
│  │  │  ├─ Dial3_2.png
│  │  │  ├─ Dial3_3.png
│  │  │  ├─ Dial3_4.png
│  │  │  ├─ Dial3_5.png
│  │  │  ├─ Dial3_6.png
│  │  │  ├─ Dial3_7.png
│  │  │  ├─ Dial4_0.png
│  │  │  ├─ Dial4_1.png
│  │  │  ├─ Dial4_2.png
│  │  │  ├─ Dial4_3.png
│  │  │  ├─ Dial4_4.png
│  │  │  ├─ Dial4_5.png
│  │  │  ├─ Dial4_6.png
│  │  │  ├─ Dial4_7.png
│  │  │  ├─ Online_0.png
│  │  │  ├─ Online_1.png
│  │  │  ├─ Online_2.png
│  │  │  ├─ Online_3.png
│  │  │  ├─ Online_4.png
│  │  │  ├─ Online_5.png
│  │  │  ├─ Online_6.png
│  │  │  └─ Online_7.png
│  │  ├─ Frere Jacques.mp3
│  │  ├─ FZ.txt
│  │  ├─ FZ1.png
│  │  ├─ FZ2.png
│  │  ├─ guidebook.png
│  │  ├─ movenet_keypoint.png
│  │  ├─ settings - 복사본.png
│  │  ├─ settings.png
│  │  ├─ sheet
│  │  │  ├─ 1.gif
│  │  │  ├─ 10.gif
│  │  │  ├─ 100.gif
│  │  │  ├─ 101.gif
│  │  │  ├─ 102.gif
│  │  │  ├─ 103.gif
│  │  │  ├─ 104.gif
│  │  │  ├─ 105.gif
│  │  │  ├─ 106.gif
│  │  │  ├─ 107.gif
│  │  │  ├─ 108.gif
│  │  │  ├─ 109.gif
│  │  │  ├─ 11.gif
│  │  │  ├─ 110.gif
│  │  │  ├─ 111.gif
│  │  │  ├─ 112.gif
│  │  │  ├─ 113.gif
│  │  │  ├─ 114.gif
│  │  │  ├─ 115.gif
│  │  │  ├─ 116.gif
│  │  │  ├─ 12.gif
│  │  │  ├─ 13.gif
│  │  │  ├─ 14.gif
│  │  │  ├─ 15.gif
│  │  │  ├─ 16.gif
│  │  │  ├─ 17.gif
│  │  │  ├─ 18.gif
│  │  │  ├─ 19.gif
│  │  │  ├─ 2.gif
│  │  │  ├─ 20.gif
│  │  │  ├─ 21.gif
│  │  │  ├─ 22.gif
│  │  │  ├─ 23.gif
│  │  │  ├─ 24.gif
│  │  │  ├─ 25.gif
│  │  │  ├─ 26.gif
│  │  │  ├─ 27.gif
│  │  │  ├─ 28.gif
│  │  │  ├─ 29.gif
│  │  │  ├─ 3.gif
│  │  │  ├─ 30.gif
│  │  │  ├─ 31.gif
│  │  │  ├─ 32.gif
│  │  │  ├─ 33.gif
│  │  │  ├─ 34.gif
│  │  │  ├─ 35.gif
│  │  │  ├─ 36.gif
│  │  │  ├─ 37.gif
│  │  │  ├─ 38.gif
│  │  │  ├─ 39.gif
│  │  │  ├─ 4.gif
│  │  │  ├─ 40.gif
│  │  │  ├─ 41.gif
│  │  │  ├─ 42.gif
│  │  │  ├─ 43.gif
│  │  │  ├─ 44.gif
│  │  │  ├─ 45.gif
│  │  │  ├─ 46.gif
│  │  │  ├─ 47.gif
│  │  │  ├─ 48.gif
│  │  │  ├─ 49.gif
│  │  │  ├─ 5.gif
│  │  │  ├─ 50.gif
│  │  │  ├─ 51.gif
│  │  │  ├─ 52.gif
│  │  │  ├─ 53.gif
│  │  │  ├─ 54.gif
│  │  │  ├─ 55.gif
│  │  │  ├─ 56.gif
│  │  │  ├─ 57.gif
│  │  │  ├─ 58.gif
│  │  │  ├─ 59.gif
│  │  │  ├─ 6.gif
│  │  │  ├─ 60.gif
│  │  │  ├─ 61.gif
│  │  │  ├─ 62.gif
│  │  │  ├─ 63.gif
│  │  │  ├─ 64.gif
│  │  │  ├─ 65.gif
│  │  │  ├─ 66.gif
│  │  │  ├─ 67.gif
│  │  │  ├─ 68.gif
│  │  │  ├─ 69.gif
│  │  │  ├─ 7.gif
│  │  │  ├─ 70.gif
│  │  │  ├─ 71.gif
│  │  │  ├─ 72.gif
│  │  │  ├─ 73.gif
│  │  │  ├─ 74.gif
│  │  │  ├─ 75.gif
│  │  │  ├─ 76.gif
│  │  │  ├─ 77.gif
│  │  │  ├─ 78.gif
│  │  │  ├─ 79.gif
│  │  │  ├─ 8.gif
│  │  │  ├─ 80.gif
│  │  │  ├─ 81.gif
│  │  │  ├─ 82.gif
│  │  │  ├─ 83.gif
│  │  │  ├─ 84.gif
│  │  │  ├─ 85.gif
│  │  │  ├─ 86.gif
│  │  │  ├─ 87.gif
│  │  │  ├─ 88.gif
│  │  │  ├─ 89.gif
│  │  │  ├─ 9.gif
│  │  │  ├─ 90.gif
│  │  │  ├─ 91.gif
│  │  │  ├─ 92.gif
│  │  │  ├─ 93.gif
│  │  │  ├─ 94.gif
│  │  │  ├─ 95.gif
│  │  │  ├─ 96.gif
│  │  │  ├─ 97.gif
│  │  │  ├─ 98.gif
│  │  │  ├─ 99.gif
│  │  │  ├─ 프래르자크_2.gif
│  │  │  └─ 프레르-자크.gif
│  │  ├─ sheetmenuIcon.png
│  │  ├─ sheetmenuIcon2.png
│  │  ├─ stretching-exercises.png
│  │  └─ suisou.png
│  └─ utils
│     └─ getSpeech.jsx
├─ yarn.lock
└─ 기술문서.pdf

```
```
voice-home-training-front
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ config
│  ├─ description
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ objects
│  │  ├─ 02
│  │  │  ├─ 0c09212c252ea563d4e268e7b2e8cea98942b2
│  │  │  └─ 3af85899d0760bcc99d7fe85a667013096d3f4
│  │  ├─ 05
│  │  │  └─ 28e2cebc882228d6bc73ec18f1c117c5ada043
│  │  ├─ 0b
│  │  │  ├─ 1ab700941cd28d50b1ba8dc7744129c6849a9f
│  │  │  └─ afc002948232355127cf085f92fb0c07d068b6
│  │  ├─ 14
│  │  │  ├─ 35f401a4f1c068c0e8d2766528b3a3453d8a68
│  │  │  ├─ 99bccb0bee8b01dc71aa7e88fdad5364ead1c8
│  │  │  ├─ b5d5156dacf0f682bdbce8af6e05cd3ec0a04b
│  │  │  └─ d5ff207af730598dc3b4be090ff1877dbc06b2
│  │  ├─ 19
│  │  │  └─ 40d1f8002f588176377b306657e3f2b734689c
│  │  ├─ 1b
│  │  │  └─ 807269856321ff618a22f42d6ae6cc8853f19c
│  │  ├─ 21
│  │  │  ├─ 9da84df94852a000606668c5c06e4f95b744b7
│  │  │  └─ d325f5e4a6ed9f752b0744624574461a4ec426
│  │  ├─ 22
│  │  │  └─ d41a10226e6a74daadea57ad39c45165b8db99
│  │  ├─ 24
│  │  │  └─ 2a3d6755d2c71a3b45eda42fc98e3e3b6676a8
│  │  ├─ 25
│  │  │  ├─ 4feec4032918e58438835cf4dbb41600c911c8
│  │  │  └─ 6540f42bb51ff2188200871c2bfa80c0613841
│  │  ├─ 27
│  │  │  └─ 0c3dd2a861f5a130f408b52dd5b079a422dbfe
│  │  ├─ 2f
│  │  │  └─ 039beb2a2a7315c70c3ca3c2d96a37d8ce46bd
│  │  ├─ 34
│  │  │  └─ 0e3f7e0b0449b0ac8abd654522694c7ec1450d
│  │  ├─ 36
│  │  │  └─ 93353f1e8963c813e3535b5684ea439fc3a44e
│  │  ├─ 3c
│  │  │  └─ a4be0a961f6d4f319bcbbf6a72d89825b07e7a
│  │  ├─ 40
│  │  │  └─ 4e7271be5d3aaed6334dcd76cb6bee90238a58
│  │  ├─ 41
│  │  │  ├─ 50c2c3f913d51daccea10598e70262f5832e69
│  │  │  └─ 5b1a9440ee93895fb47b0f7c5d9a4d723cbdd7
│  │  ├─ 45
│  │  │  └─ ba63be4fc15a7b75002b7d3535d5212e5b8a4d
│  │  ├─ 46
│  │  │  └─ cca88a41fa2c61aba64264920d1a07e30c434b
│  │  ├─ 47
│  │  │  └─ 46951bde2ae1514f73fae32dc25ec6e16b93ee
│  │  ├─ 4c
│  │  │  └─ 58fcc498fc94da1991bc62bcd1ac244af1500d
│  │  ├─ 4d
│  │  │  └─ 8529216bb1badab7a98e83be89e45a2a679908
│  │  ├─ 4e
│  │  │  └─ 1a40a84e4bcda5451be968d42ad9155ac2beca
│  │  ├─ 51
│  │  │  └─ b30c1b7de828fe046a25dec79fc83499b2c326
│  │  ├─ 54
│  │  │  └─ 41959a31c252b7d314e39fa496701b5c3cbe9b
│  │  ├─ 56
│  │  │  └─ ffdbde0cf8858a3f63e2bbb3e26e340de6818e
│  │  ├─ 5c
│  │  │  └─ 574a5b006d59b025c8f5bb11fec6eedbe7a4c4
│  │  ├─ 63
│  │  │  └─ b803bcb0d60bef9f6ab20e91fa390928709c9e
│  │  ├─ 65
│  │  │  └─ df6491d4a0fe1572fd9e290d7b7d95a1b5a744
│  │  ├─ 67
│  │  │  └─ 5bfeded45fa95d5c7bf330dece7f420caf1085
│  │  ├─ 68
│  │  │  └─ 3300ecc7a347629f78da64e981aeb612c82412
│  │  ├─ 69
│  │  │  ├─ 30e22e362e9293670ef8bf6e8724f004e83025
│  │  │  └─ 42275eaaaca8984bc4c39e0e64012d81b5f706
│  │  ├─ 6a
│  │  │  └─ c68145aca9d22a5b3384b731b5a9ef0ec5c9b2
│  │  ├─ 6b
│  │  │  └─ 7af08e7dfaeb8ec422f6f8e26054aeee4b2dcb
│  │  ├─ 70
│  │  │  └─ 2355043b6cdfe95dbfc5ef15c5634b16532539
│  │  ├─ 72
│  │  │  └─ e8e995c4d3fd7f7aea9257b82f02be89f8f542
│  │  ├─ 73
│  │  │  └─ c9324b71745d5c75850a9aa64d2cd6d0a6a213
│  │  ├─ 74
│  │  │  └─ 0bacdf4bccad91fc4d0b0ba6fbb5d3c230b2a9
│  │  ├─ 75
│  │  │  └─ 68630a544bf6c795975ac122e14a221bb5ddea
│  │  ├─ 76
│  │  │  └─ 7275ff6b5f4c60d3f087bf3114552473aa40d3
│  │  ├─ 81
│  │  │  ├─ 06475fe8478e6dcf9524c68a44288330adaf1f
│  │  │  └─ 1cb9c770eac8f2c1bdcc29e13ed47d772c816b
│  │  ├─ 82
│  │  │  └─ f9679d0a302b1c86e3d9f53a2296848418829b
│  │  ├─ 83
│  │  │  └─ bf1bbe3990b8e4811fe7b66a78651db1331691
│  │  ├─ 84
│  │  │  └─ d2d56450bc0cf869b0ab2acc32c1ee69fd07b4
│  │  ├─ 8a
│  │  │  ├─ 0b668275123ebcd531e25ece9c61bb21d9f185
│  │  │  └─ 4ede7ae70b69542482a4013dc1eb4b282ce17f
│  │  ├─ 8d
│  │  │  └─ 55dc27370f81bebefd10cded0cdb469b752f89
│  │  ├─ 92
│  │  │  └─ 6b890e6368acd536f2ff82a53a4639499e44cb
│  │  ├─ 93
│  │  │  └─ 96bb9de8c3bb5904961362080a0293062ad0d2
│  │  ├─ 94
│  │  │  └─ 6606e8dff2aeb293ad7e1e135ac24a9fb12542
│  │  ├─ 95
│  │  │  └─ d6d17b6eecb363bcd9b9e5866e99eda8111901
│  │  ├─ 97
│  │  │  └─ c6742b2b24fc0ac6cec992f30f12a1f17502f1
│  │  ├─ 98
│  │  │  └─ d237e6999a85e2e3e2d2ed0eca70abdf76755b
│  │  ├─ 9d
│  │  │  └─ 31ecf6ab1070a17267640ec0fca8a75f27ebc2
│  │  ├─ a0
│  │  │  └─ 24766613317820db1657fa7e3e7d84f4567d8f
│  │  ├─ a5
│  │  │  └─ 2e042a6eb4bda8135ab653490eaad1d008577c
│  │  ├─ ad
│  │  │  └─ a7c1b28e150b9d930950b99b146dd386e6c559
│  │  ├─ b2
│  │  │  └─ cd0dccf739e8ba0f98fcc64671d6ac19df3d45
│  │  ├─ b4
│  │  │  └─ c0b0b6c7e034db52e01b495caecd867710666e
│  │  ├─ bb
│  │  │  └─ b5f95740609d33180bcebb48201f4468630fa4
│  │  ├─ be
│  │  │  ├─ 621a35614f34c9f1620dc0013f2fd50a2c2b87
│  │  │  └─ f4b7932b2661c8cfbb43c98b64ec79bfa5f01e
│  │  ├─ c1
│  │  │  └─ 71e2df54a7c23b54100c7101a1ab70dd9e669d
│  │  ├─ c5
│  │  │  └─ 016b77f43722c5e66f66668bb3ff76b09a8180
│  │  ├─ cc
│  │  │  └─ e33983de55631c0220862ac44bcc8ff0f29dff
│  │  ├─ cd
│  │  │  └─ ef0a513a15b79120af5c421becb9b9854d4c8c
│  │  ├─ d6
│  │  │  ├─ 81609557ffbceae688375d58d7bc3923b0e7a1
│  │  │  └─ 84aa60beae0466a76d67c2b0ed4890a5d5c28d
│  │  ├─ da
│  │  │  └─ 1665466da9474f0f450a876781aa5092f5d2ea
│  │  ├─ db
│  │  │  └─ 76180c787e7073f2bc5864184d19e97dc3e977
│  │  ├─ e0
│  │  │  └─ 616da143e6203d8368149fcdbd47e1db11b065
│  │  ├─ e3
│  │  │  └─ d44c2e3cf12974dc0a26f99b3773a81ea93cf5
│  │  ├─ e6
│  │  │  └─ 070acb56e0557ddcf696c451dad750c178a44e
│  │  ├─ fb
│  │  │  └─ fe6e9df611992485b4b42ed19d0519a02345f8
│  │  ├─ fe
│  │  │  └─ 3315166a56b74db7bf68b65cd2dc58c6a7ff6f
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-222fcc66744c7906d72f925b6db7fba2a2adf246.idx
│  │     ├─ pack-222fcc66744c7906d72f925b6db7fba2a2adf246.pack
│  │     └─ pack-222fcc66744c7906d72f925b6db7fba2a2adf246.rev
│  ├─ ORIG_HEAD
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     ├─ HEAD
│     │     └─ main
│     └─ tags
├─ .gitignore
├─ alembic.ini
├─ LICENSE
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.ico
│  ├─ images
│  │  ├─ Dial.psd
│  │  ├─ Dial1_0.png
│  │  ├─ Dial1_1.png
│  │  ├─ Dial1_2.png
│  │  ├─ Dial1_3.png
│  │  ├─ Dial1_4.png
│  │  ├─ Dial1_5.png
│  │  ├─ Dial1_6.png
│  │  ├─ Dial1_7.png
│  │  ├─ Dial2_0.png
│  │  ├─ Dial2_1.png
│  │  ├─ Dial2_2.png
│  │  ├─ Dial2_3.png
│  │  ├─ Dial2_4.png
│  │  ├─ Dial2_5.png
│  │  ├─ Dial2_6.png
│  │  ├─ Dial2_7.png
│  │  ├─ Dial3_0.png
│  │  ├─ Dial3_1.png
│  │  ├─ Dial3_2.png
│  │  ├─ Dial3_3.png
│  │  ├─ Dial3_4.png
│  │  ├─ Dial3_5.png
│  │  ├─ Dial3_6.png
│  │  ├─ Dial3_7.png
│  │  ├─ Dial4_0.png
│  │  ├─ Dial4_1.png
│  │  ├─ Dial4_2.png
│  │  ├─ Dial4_3.png
│  │  ├─ Dial4_4.png
│  │  ├─ Dial4_5.png
│  │  ├─ Dial4_6.png
│  │  ├─ Dial4_7.png
│  │  ├─ Online_0.png
│  │  ├─ Online_1.png
│  │  ├─ Online_2.png
│  │  ├─ Online_3.png
│  │  ├─ Online_4.png
│  │  ├─ Online_5.png
│  │  ├─ Online_6.png
│  │  └─ Online_7.png
│  ├─ index.html
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ manifest.json
│  └─ robots.txt
├─ README.md
├─ readme2.md
├─ src
│  ├─ App.css
│  ├─ App.js
│  ├─ App.test.js
│  ├─ index.css
│  ├─ index.js
│  ├─ lib
│  │  └─ api.jsx
│  ├─ logo.svg
│  ├─ reportWebVitals.js
│  ├─ setupTests.js
│  ├─ src
│  │  ├─ bar.png
│  │  ├─ BPL.png
│  │  ├─ Dial
│  │  │  ├─ Dial.psd
│  │  │  ├─ Dial1_0.png
│  │  │  ├─ Dial1_1.png
│  │  │  ├─ Dial1_2.png
│  │  │  ├─ Dial1_3.png
│  │  │  ├─ Dial1_4.png
│  │  │  ├─ Dial1_5.png
│  │  │  ├─ Dial1_6.png
│  │  │  ├─ Dial1_7.png
│  │  │  ├─ Dial2_0.png
│  │  │  ├─ Dial2_1.png
│  │  │  ├─ Dial2_2.png
│  │  │  ├─ Dial2_3.png
│  │  │  ├─ Dial2_4.png
│  │  │  ├─ Dial2_5.png
│  │  │  ├─ Dial2_6.png
│  │  │  ├─ Dial2_7.png
│  │  │  ├─ Dial3_0.png
│  │  │  ├─ Dial3_1.png
│  │  │  ├─ Dial3_2.png
│  │  │  ├─ Dial3_3.png
│  │  │  ├─ Dial3_4.png
│  │  │  ├─ Dial3_5.png
│  │  │  ├─ Dial3_6.png
│  │  │  ├─ Dial3_7.png
│  │  │  ├─ Dial4_0.png
│  │  │  ├─ Dial4_1.png
│  │  │  ├─ Dial4_2.png
│  │  │  ├─ Dial4_3.png
│  │  │  ├─ Dial4_4.png
│  │  │  ├─ Dial4_5.png
│  │  │  ├─ Dial4_6.png
│  │  │  ├─ Dial4_7.png
│  │  │  ├─ Online_0.png
│  │  │  ├─ Online_1.png
│  │  │  ├─ Online_2.png
│  │  │  ├─ Online_3.png
│  │  │  ├─ Online_4.png
│  │  │  ├─ Online_5.png
│  │  │  ├─ Online_6.png
│  │  │  └─ Online_7.png
│  │  ├─ Frere Jacques.mp3
│  │  ├─ FZ.txt
│  │  ├─ FZ1.png
│  │  ├─ FZ2.png
│  │  ├─ guidebook.png
│  │  ├─ movenet_keypoint.png
│  │  ├─ settings - 복사본.png
│  │  ├─ settings.png
│  │  ├─ sheet
│  │  │  ├─ 1.gif
│  │  │  ├─ 10.gif
│  │  │  ├─ 100.gif
│  │  │  ├─ 101.gif
│  │  │  ├─ 102.gif
│  │  │  ├─ 103.gif
│  │  │  ├─ 104.gif
│  │  │  ├─ 105.gif
│  │  │  ├─ 106.gif
│  │  │  ├─ 107.gif
│  │  │  ├─ 108.gif
│  │  │  ├─ 109.gif
│  │  │  ├─ 11.gif
│  │  │  ├─ 110.gif
│  │  │  ├─ 111.gif
│  │  │  ├─ 112.gif
│  │  │  ├─ 113.gif
│  │  │  ├─ 114.gif
│  │  │  ├─ 115.gif
│  │  │  ├─ 116.gif
│  │  │  ├─ 12.gif
│  │  │  ├─ 13.gif
│  │  │  ├─ 14.gif
│  │  │  ├─ 15.gif
│  │  │  ├─ 16.gif
│  │  │  ├─ 17.gif
│  │  │  ├─ 18.gif
│  │  │  ├─ 19.gif
│  │  │  ├─ 2.gif
│  │  │  ├─ 20.gif
│  │  │  ├─ 21.gif
│  │  │  ├─ 22.gif
│  │  │  ├─ 23.gif
│  │  │  ├─ 24.gif
│  │  │  ├─ 25.gif
│  │  │  ├─ 26.gif
│  │  │  ├─ 27.gif
│  │  │  ├─ 28.gif
│  │  │  ├─ 29.gif
│  │  │  ├─ 3.gif
│  │  │  ├─ 30.gif
│  │  │  ├─ 31.gif
│  │  │  ├─ 32.gif
│  │  │  ├─ 33.gif
│  │  │  ├─ 34.gif
│  │  │  ├─ 35.gif
│  │  │  ├─ 36.gif
│  │  │  ├─ 37.gif
│  │  │  ├─ 38.gif
│  │  │  ├─ 39.gif
│  │  │  ├─ 4.gif
│  │  │  ├─ 40.gif
│  │  │  ├─ 41.gif
│  │  │  ├─ 42.gif
│  │  │  ├─ 43.gif
│  │  │  ├─ 44.gif
│  │  │  ├─ 45.gif
│  │  │  ├─ 46.gif
│  │  │  ├─ 47.gif
│  │  │  ├─ 48.gif
│  │  │  ├─ 49.gif
│  │  │  ├─ 5.gif
│  │  │  ├─ 50.gif
│  │  │  ├─ 51.gif
│  │  │  ├─ 52.gif
│  │  │  ├─ 53.gif
│  │  │  ├─ 54.gif
│  │  │  ├─ 55.gif
│  │  │  ├─ 56.gif
│  │  │  ├─ 57.gif
│  │  │  ├─ 58.gif
│  │  │  ├─ 59.gif
│  │  │  ├─ 6.gif
│  │  │  ├─ 60.gif
│  │  │  ├─ 61.gif
│  │  │  ├─ 62.gif
│  │  │  ├─ 63.gif
│  │  │  ├─ 64.gif
│  │  │  ├─ 65.gif
│  │  │  ├─ 66.gif
│  │  │  ├─ 67.gif
│  │  │  ├─ 68.gif
│  │  │  ├─ 69.gif
│  │  │  ├─ 7.gif
│  │  │  ├─ 70.gif
│  │  │  ├─ 71.gif
│  │  │  ├─ 72.gif
│  │  │  ├─ 73.gif
│  │  │  ├─ 74.gif
│  │  │  ├─ 75.gif
│  │  │  ├─ 76.gif
│  │  │  ├─ 77.gif
│  │  │  ├─ 78.gif
│  │  │  ├─ 79.gif
│  │  │  ├─ 8.gif
│  │  │  ├─ 80.gif
│  │  │  ├─ 81.gif
│  │  │  ├─ 82.gif
│  │  │  ├─ 83.gif
│  │  │  ├─ 84.gif
│  │  │  ├─ 85.gif
│  │  │  ├─ 86.gif
│  │  │  ├─ 87.gif
│  │  │  ├─ 88.gif
│  │  │  ├─ 89.gif
│  │  │  ├─ 9.gif
│  │  │  ├─ 90.gif
│  │  │  ├─ 91.gif
│  │  │  ├─ 92.gif
│  │  │  ├─ 93.gif
│  │  │  ├─ 94.gif
│  │  │  ├─ 95.gif
│  │  │  ├─ 96.gif
│  │  │  ├─ 97.gif
│  │  │  ├─ 98.gif
│  │  │  ├─ 99.gif
│  │  │  ├─ 프래르자크_2.gif
│  │  │  └─ 프레르-자크.gif
│  │  ├─ sheetmenuIcon.png
│  │  ├─ sheetmenuIcon2.png
│  │  ├─ stretching-exercises.png
│  │  └─ suisou.png
│  └─ utils
│     └─ getSpeech.jsx
├─ yarn.lock
└─ 기술문서.pdf

```