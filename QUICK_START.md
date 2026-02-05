# ⚡ 빠른 시작 가이드

## 🎯 5분 안에 배포하기

### Step 1: GitHub 업로드 (2분)

1. **GitHub.com** 접속 → 로그인
2. **New repository** 클릭
3. 이름: `housing-ai-nextjs`
4. Public 선택 → **Create**
5. **Upload files** → 다운로드한 `nextjs` 폴더 드래그
6. **Commit** 클릭

### Step 2: Vercel 배포 (3분)

1. **https://vercel.com** 접속
2. **Sign Up** → **GitHub로 로그인**
3. **New Project** 클릭
4. `housing-ai-nextjs` 선택 → **Import**
5. 아무것도 수정하지 말고 **Deploy** 클릭!

### Step 3: 완료! ✅

```
🎉 완료!
URL: https://housing-ai-nextjs.vercel.app

이제 이 링크를 당신 웹사이트에 공유하세요!
```

---

## 🌐 웹사이트 통합 방법

### 방법 1: 직접 링크
```html
<a href="https://housing-ai-nextjs.vercel.app">
  부동산 가격 계산기
</a>
```

### 방법 2: iframe 임베드
```html
<iframe 
  src="https://housing-ai-nextjs.vercel.app"
  width="100%"
  height="1000px"
  style="border: none;"
></iframe>
```

### 방법 3: 팝업
```html
<button onclick="window.open('https://housing-ai-nextjs.vercel.app', 'popup', 'width=1200,height=800')">
  계산기 열기
</button>
```

---

## 🔧 코드 수정하기

### 파일 수정 (GitHub 웹사이트에서)

1. GitHub 저장소 → 파일 클릭
2. 연필 아이콘 (Edit) 클릭
3. 수정
4. **Commit** 클릭

→ 1-2분 후 Vercel이 자동으로 재배포!

### 색상 변경 예시

**파일:** `app/layout.js`

```javascript
// 기존
primary: {
  main: '#1C83E1',  // 파란색
}

// 변경
primary: {
  main: '#FF6B6B',  // 빨간색
}
```

---

## 📊 방문자 확인

1. **Vercel 대시보드** 접속
2. **Analytics** 클릭
3. 실시간 방문자, 로딩 속도 등 확인!

---

## ❓ 문제 발생 시

### 빌드 실패?
```
Vercel → Settings → General
Node.js Version: 18.x 선택
Redeploy
```

### 화면 안 보임?
```
브라우저 F12 → Console 확인
대부분 데이터 로딩 문제
```

### 데이터 안 나옴?
```
GitHub 저장소 Public인지 확인
market_cache.json 파일 있는지 확인
```

---

## 🎉 끝!

이제 초고속 부동산 계산기가 준비되었습니다!

**다음:** [상세 가이드](./DEPLOYMENT_GUIDE.md) 읽기
