'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Todo {
  id: number;
  title: string;
  is_completed: boolean;
  due_date: string;
}

type FilterType = '전체' | '진행 중' | '완료';

const FILTERS: FilterType[] = ['전체', '진행 중', '완료'];
const KOR_DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [weekBase, setWeekBase] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTitle, setNewTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('전체');
  const router = useRouter();

  const fetchTodos = useCallback(async () => {
    const res = await fetch('/api/todos');
    if (res.ok) setTodos(await res.json());
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const weekStart = startOfWeek(weekBase, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const countForDay = (day: Date) =>
    todos.filter(t => t.due_date === format(day, 'yyyy-MM-dd')).length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.trim(),
        due_date: format(selectedDate, 'yyyy-MM-dd'),
      }),
    });
    setNewTitle('');
    fetchTodos();
  };

  const handleToggle = async (todo: Todo) => {
    await fetch(`/api/todos?id=${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_completed: !todo.is_completed }),
    });
    fetchTodos();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  const displayed = todos
    .filter(t => t.due_date === format(selectedDate, 'yyyy-MM-dd'))
    .filter(t => {
      if (filter === '진행 중') return !t.is_completed;
      if (filter === '완료') return t.is_completed;
      return true;
    })
    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#ecedf7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">

        {/* 제목 */}
        <h1 className="text-2xl font-bold italic text-center text-[#2d1b69] mb-4">
          Todo List
        </h1>

        {/* 주간 네비게이션 */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setWeekBase(prev => subWeeks(prev, 1))}
            className="text-purple-300 hover:text-purple-600 px-1 text-sm"
          >
            ◀
          </button>
          <span className="text-xs text-gray-400">
            {format(weekStart, 'yyyy-MM-dd')} ~ {format(weekEnd, 'yyyy-MM-dd')}
          </span>
          <button
            onClick={() => setWeekBase(prev => addWeeks(prev, 1))}
            className="text-purple-300 hover:text-purple-600 px-1 text-sm"
          >
            ▶
          </button>
        </div>

        {/* 요일 버튼 */}
        <div className="grid grid-cols-7 gap-1 mb-5">
          {weekDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const count = countForDay(day);
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center py-2 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-[#3b0f7f] text-white'
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                <span className="text-[11px]">{KOR_DAYS[i]}</span>
                {/* 수정: 선택한 날짜 셀의 날짜는 굵은 폰트(font-bold) */}
                <span className={`text-sm mt-0.5 ${isSelected ? 'font-bold' : 'font-normal'}`}>{format(day, 'd')}</span>
                {/* 영상: 0도 항상 표시 */}
                <span className="text-[10px] mt-0.5 h-3">{count}</span>
              </button>
            );
          })}
        </div>

        {/* 할 일 추가 입력 */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-3">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="할 일을 입력하세요"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            className="bg-[#5b21b6] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-900 transition-colors"
          >
            추가
          </button>
        </form>

        {/* 검색 */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="flex-1 text-sm outline-none text-gray-700"
          />
        </div>

        {/* 필터 탭 */}
        <div className="flex gap-2 mb-4">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-[#5b21b6] text-white'
                  : 'border border-gray-300 text-gray-500 hover:border-purple-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo 목록 */}
        <ul className="space-y-2">
          {displayed.map(todo => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-3 py-2.5 border border-gray-100 rounded-xl"
            >
              {/* 완료 토글 */}
              <button
                onClick={() => handleToggle(todo)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
                  todo.is_completed
                    ? 'bg-[#5b21b6] border-[#5b21b6]'
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              />
              {/* 제목 */}
              <span
                className={`flex-1 text-sm ${
                  todo.is_completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {todo.title}
              </span>
              {/* 수정 버튼 */}
              <button
                onClick={() => router.push(`/todos/${todo.id}`)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-purple-100 text-gray-500 hover:text-purple-600 text-xs transition-all"
                aria-label="수정"
              >
                ✎
              </button>
              {/* 삭제 버튼 */}
              <button
                onClick={() => handleDelete(todo.id)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 text-xs transition-all"
                aria-label="삭제"
              >
                ✕
              </button>
            </li>
          ))}
          {/* 영상: 빈 상태 문구 */}
          {displayed.length === 0 && (
            <li className="text-center text-gray-400 text-sm py-6">
              할 일이 없습니다. 추가해보세요!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
