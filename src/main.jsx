import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Tailwind CSS가 포함된 CSS 파일 가져오기

// HTML 파일에 존재하는 <div id="root"> 요소를 찾아 리액트 루트로 지정합니다.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 전체 상태와 Todo 앱의 메인 레이아웃을 담은 최상위 컴포넌트를 실행합니다. */}
    <App />
  </StrictMode>
);