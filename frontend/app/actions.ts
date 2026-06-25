'use server'

// 환경변수에서 URL을 가져오기
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function getTodos() {
  const res = await fetch(`${BACKEND_URL}/todos`, {
    cache: 'no-store', 
  });
  // URL fetch에 실패하면 에러 던지기
  if (!res.ok) throw new Error('FastAPI 서버에서 Todo 목록을 불러오는 데 실패했습니다.');
  return res.json();
}

export async function getTodo(id: number) {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Todo 상세 정보를 불러오는 데 실패했습니다.');
  }
  return res.json();
}