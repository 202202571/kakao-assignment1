import React from 'react';

export default function WeekNavigator({ selectedDate, onChangeDate, totalTodos = [] }) {
  // 현재 선택된 날짜 객체 생성
  const current = new Date(selectedDate);
  
  // 일요일을 한 주의 시작으로 잡도록 구성합니다. (기존 캘린더와 동일한 방식)
  const dayOfWeek = current.getDay(); 
  const sunday = new Date(current);
  sunday.setDate(current.getDate() - dayOfWeek);

  // 일요일(0)부터 토요일(6)까지 자바스크립트 날짜 함수의 흐름을 그대로 따르는 7일 배열 생성
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i); // 하루씩 더해서 일~토까지 채워나갑니다.
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return {
      dateStr,
      dayNum: d.getDate(),
      // 일반적인 달력과 동일하게 일요일부터 한 주가 시작되도록 설정합니다.
      dayName: ['일', '월', '화', '수', '목', '금', '토'][i]
    };
  });

  // 주차 이동 핸들러 (7일 가감)
  const handleMoveWeek = (amount) => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + amount * 7);
    
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextDate.getDate()).padStart(2, '0');
    onChangeDate(`${year}-${month}-${day}`);
  };

  // 주간 범위 문자열 포맷팅 (일요일 ~ 토요일 범위 표시)
  const formatRangeDate = (d) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  const weekRangeString = `${formatRangeDate(sunday)} ~ ${formatRangeDate(saturday)}`;

  return (
    <div className="w-full text-center mb-6">
      {/* 상단 범위 및 좌우 화살표 내비게이션 */}
      <div className="flex justify-center items-center gap-4 mb-4">
        <button 
          onClick={() => handleMoveWeek(-1)}
          className="text-gray-400 hover:text-[#0099e5] text-sm font-bold transition-colors cursor-pointer p-1"
        >
          ◀
        </button>
        <span className="text-xs font-semibold text-gray-400 tracking-wider">
          {weekRangeString}
        </span>
        <button 
          onClick={() => handleMoveWeek(1)}
          className="text-gray-400 hover:text-[#0099e5] text-sm font-bold transition-colors cursor-pointer p-1"
        >
          ▶
        </button>
      </div>

      {/* 7일 가로 나열 달력 격자 (일~토 흐름 완성) */}
      <div className="grid grid-cols-7 gap-2 bg-slate-50/50 p-2 rounded-2xl border border-gray-100">
        {weekDays.map((day) => {
          const isSelected = day.dateStr === selectedDate;
          
          // 수정: filter 함수 안에서 완료된 항목은 반전시키는 '!' 연산자를 통해 isCompleted가 1이면 0으로 todo.date에 반영이 되지 않도록 카운트 값을 조정합니다.
          const dayTodoCount = totalTodos.filter(
            (todo) => todo.date === day.dateStr && !todo.isCompleted
          ).length;

          return (
            <button
              key={day.dateStr}
              onClick={() => onChangeDate(day.dateStr)}
              className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all aspect-square cursor-pointer
                ${isSelected 
                  ? 'bg-[#0099e5] text-white shadow-md font-bold' 
                  : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              {/* 요일 이름 표기 (주말 색상 분기) */}
              <span className={`text-[10px] mb-0.5 ${
                isSelected 
                  ? 'text-white/80' 
                  : day.dayName === '일' ? 'text-red-400' : day.dayName === '토' ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {day.dayName}
              </span>
              
              {/* 일자 숫자 */}
              <span className="text-sm font-bold">{day.dayNum}</span>

              {/* 할 일 추가/완료 즉시 실시간으로 변동되어 찍히는 일별 Count 공간 */}
              <div className="h-3 mt-0.5 flex items-center justify-center">
                {dayTodoCount > 0 ? (
                  <span className={`text-[9px] font-extrabold ${isSelected ? 'text-white' : 'text-[#0099e5]'}`}>
                    {dayTodoCount}
                  </span>
                ) : (
                  <span className="text-[9px] text-transparent select-none">-</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}