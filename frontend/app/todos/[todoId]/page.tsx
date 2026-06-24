'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTodo } from '@/app/actions';

interface Todo {
  id: number;
  title: string;
  is_completed: boolean;
}

export default function TodoDetailPage({ params }: { params: Promise<{ todoId: string }> }) {
  const { todoId } = React.use(params);
  const id = parseInt(todoId);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (isNaN(id)) { router.replace('/todos'); return; }
      try {
        const data = await getTodo(id);
        if (!data) { router.replace('/todos'); return; }
        setTodo(data);
        setNewTitle(data.title);
      } catch (err) {
        console.error(err);
        alert('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

  const handleToggle = async () => {
    if (!todo) return;
    const res = await fetch(`/api/todos?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_completed: !todo.is_completed }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodo(updated);
    }
  };

  const handleUpdate = async () => {
    if (!todo || !newTitle.trim()) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/todos?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (res.ok) {
        router.push('/todos');
      } else {
        alert('수정에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ecedf7] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">로딩 중...</p>
      </div>
    );
  }

  if (!todo) return null;

  return (
    <div className="min-h-screen bg-[#ecedf7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold italic text-[#2d1b69]">Todo 수정</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← 돌아가기
          </button>
        </div>

        <div className="space-y-4">
          {/* 제목 입력 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">할 일 내용</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400"
            />
          </div>

          {/* 완료 상태 토글 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggle}
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
                todo.is_completed
                  ? 'bg-[#5b21b6] border-[#5b21b6]'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
            />
            <span className="text-sm text-gray-600">
              {todo.is_completed ? '완료' : '진행 중'}
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => router.back()}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating || !newTitle.trim()}
            className="flex-1 py-2 bg-[#5b21b6] text-white rounded-lg text-sm font-semibold hover:bg-purple-900 disabled:opacity-50 transition-colors"
          >
            {isUpdating ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
