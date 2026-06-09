import { useState } from 'react';

export default function TodoItem({ todo, onUpdate, onComplete, onDelete }) {
  // 수정: prompt() 말고, 수정 버튼을 누르면 Todo 항목에서 바로 수정할 수 있도록 수정했습니다.
  const [isEditing, setIsEditing] = useState(false);
  // 수정 창 내부의 텍스트를 독립적으로 제어하기 위한 임시 상태
  const [editText, setEditText] = useState(todo.text);

  // 수정본을 저장할 때 호출되는 핸들러 함수
  const handleSave = () => {
    if (editText.trim() === '') {
      alert('내용을 입력해 주세요!'); // 빈 값 예외 처리
      return;
    }
    onUpdate(todo.id, editText.trim());
    setIsEditing(false); // 수정 완료 후 다시 일반 뷰로 전환
  };

  // 추가: 키보드 이벤트를 통합 제어하는 핸들러 함수
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      // 추가: Esc를 누르면 수정 모드를 빠져 나와서 기존 텍스트로 돌아가게 됩니다.
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li
      className={`flex items-center justify-between p-3 px-4 bg-[#fdfdfd] border border-[#edf5fa] rounded-lg transition-all ${
        todo.isCompleted ? 'bg-[#f8fafc]' : ''
      }`}
    >
      {isEditing ? (
        /* 1주차 과제에서 했건던 것처럼  수정 모드일 경우와 아닌 경우에 대해 조건문을 작성하여 처리했습니다. */
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown} // 💡 기존 Enter 원라인 코드를 Esc까지 분기 가능한 통합 핸들러로 교체했습니다.
          className="flex-1 p-1 px-2 border-2 border-[#87ceeb] rounded mr-3 text-base outline-none"
          autoFocus
        />
      ) : (
        /* 완료된 Todo 항목에 대해서는 line-through라는 CSS 속성을 사용하여 빗금 표시를 한다. */
        <span
          className={`text-base text-[#333333] flex-1 mr-3 break-all ${
            todo.isCompleted ? 'line-through text-[#a0aec0]' : ''
          }`}
        >
          {todo.text}
        </span>
      )}

      <div className="flex gap-1 shrink-0">
        {/* 완료 및 취소 토글 버튼 */}
        <button
          onClick={() => onComplete(todo.id)}
          className="text-xs font-medium p-1.5 px-2.5 rounded bg-[#e1f0fa] text-[#0099e5] hover:bg-[#87ceeb] hover:text-white transition-colors cursor-pointer"
        >
          {todo.isCompleted ? '취소' : '완료'}
        </button>

        {/* 수정 상태와 수정 사항 반영(저장) 버튼 */}
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="text-xs font-medium p-1.5 px-2.5 rounded bg-[#f0f4f8] text-[#4a5568] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
        >
          {isEditing ? '저장' : '수정'}
        </button>

        {/* 삭제 버튼 */}
        <button
          onClick={() => onDelete(todo.id)}
          className="text-xs font-medium p-1.5 px-2.5 rounded bg-[#fff5f5] text-[#e53e3e] hover:bg-[#fed7d7] transition-colors cursor-pointer"
        >
          삭제
        </button>
      </div>
    </li>
  );
}