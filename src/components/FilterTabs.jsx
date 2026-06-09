export default function FilterTabs({ currentFilter, onChangeFilter }) {
  // 수정: '진행 중' 문구에서 '미완료' 탭으로 바꿔서 진행 상황을 원자적으로 0과 1 상태로 표기하고자 했습니다.
  const tabs = ['전체', '미완료', '완료'];

  return (
    <div className="flex justify-center gap-2 mt-4 border-b border-gray-100 pb-3">
      {tabs.map((tab) => {
        const isActive = currentFilter === tab;
        return (
          <button
            key={tab}
            onClick={() => onChangeFilter(tab)}
            className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-all cursor-pointer
              ${isActive 
                ? 'bg-[#e1f0fa] text-[#0099e5] font-bold shadow-xs' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}