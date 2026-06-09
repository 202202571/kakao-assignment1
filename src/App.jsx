import { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import WeekNavigator from './components/WeekNavigator';

export default function App() {
  // [로컬 스토리지 데이터 로딩 - 함수형 초기화]
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // currentFilter 하나로만 제어하며, 직관적인 한글 매칭 구조를 가져갑니다.
  const [currentFilter, setCurrentFilter] = useState('전체');

  // 현재 선택된 날짜
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // 로컬 스토리지 자동 저장
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // To-do 항목을 추가하는 핸들러 함수
  const handleAddTodo = (text) => {
    if (!text.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: text,
      isCompleted: false,
      date: selectedDate,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  // To-do 항목 수정하는 핸들러 함수
  const handleUpdateTodo = (id, newText) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };
  // To-do 항목 완료 처리하는 함수
  const handleCompleteTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    );
  };
  // To-do 항목 삭제하는 핸들러 함수
  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // 필터링 조건을 '전체', '미완료', '완료'로 두어 해결된 것과 안된 것을 원자적으로 나눌 수 있게 설계했습니다.
  const getFinalTodos = () => {
    let filtered = todos.filter((todo) => todo.date === selectedDate);

    if (currentFilter === '미완료') {
      return filtered.filter((todo) => !todo.isCompleted);
    } else if (currentFilter === '완료') {
      return filtered.filter((todo) => todo.isCompleted);
    }
    
    return filtered; // '전체'일 때는 필터 없이 반환
  };

  return (
    <div className="min-h-screen bg-[#f4f9fc] flex justify-center items-start pt-[50px]">
      <div className="bg-white w-full max-w-[450px] rounded-2xl p-6 shadow-[0_8px_24px_rgba(135,206,235,0.15)]">
        <header>
          {/* 수정: 제목은 중앙으로 위치시키고, 기울임체(Italic)를 사용하여 심미성을 높이고자 했습니다. */}
          <h1 className="text-[#0099e5] text-2xl font-bold mb-5 text-center italic">
            Todo List
          </h1>
        </header>

        <WeekNavigator 
          selectedDate={selectedDate} 
          onChangeDate={setSelectedDate} 
          totalTodos={todos} 
        />

        <TodoInput onAdd={handleAddTodo} />
        
        {/* 단일 필터 인터페이스 연결 */}
        <FilterTabs currentFilter={currentFilter} onChangeFilter={setCurrentFilter} />

        <main className="mt-5">
          <TodoList
            todos={getFinalTodos()}
            onUpdate={handleUpdateTodo}
            onComplete={handleCompleteTodo}
            onDelete={handleDeleteTodo}
          />
        </main>
      </div>
    </div>
  );
}