import { useState } from 'react';

export default function TodoInput({ onAdd }) {
  // 사용자가 입력창에 작성 중인 텍스트 상태
  const [inputText, setInputText] = useState('');

  // 폼 제출(Submit) 핸들러 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 브라우저 기본 새로고침 현상 방지

    // 예외 처리: 입력값이 비어있거나 공백만 있는 경우 생성 차단
    if (inputText.trim() === '') {
      alert('할 일을 입력해 주세요!'); // 안내 메시지 표시
      return;
    }

    // 상위 컴포넌트의 추가 함수 호출 후 입력창 비우기
    onAdd(inputText.trim());
    setInputText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="할 일을 입력하세요..."
        className="flex-1 p-3 px-4 border-2 border-[#e1f0fa] rounded-lg text-sm outline-none focus:border-[#87ceeb] transition-colors"
        autoFocus
      />
      <button
        type="submit"
        className="bg-[#87ceeb] text-white px-5 rounded-lg font-semibold hover:bg-[#0099e5] transition-colors cursor-pointer"
      >
        추가
      </button>
    </form>
  );
}