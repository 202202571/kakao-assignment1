import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// [GET] 전체 Todo 목록 조회
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/todos`, { cache: 'no-store' });
    if (!res.ok) throw new Error('FastAPI 서버에서 Todo 목록 조회 실패');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route GET Error:', error);
    return NextResponse.json({ error: '서버 내부 통신 에러가 발생했습니다.' }, { status: 500 });
  }
}

// [POST] 새 Todo 생성
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('FastAPI 서버에서 Todo 생성 실패');
    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API Route POST Error:', error);
    return NextResponse.json({ error: '서버 내부 통신 에러가 발생했습니다.' }, { status: 500 });
  }
}

// [PUT] Todo 수정
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID가 누락되었습니다.' }, { status: 400 });

    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('FastAPI 서버에서 Todo 수정 실패');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route PUT Error:', error);
    return NextResponse.json({ error: '서버 내부 통신 에러가 발생했습니다.' }, { status: 500 });
  }
}

// [DELETE] Todo 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID가 누락되었습니다.' }, { status: 400 });

    const res = await fetch(`${BACKEND_URL}/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('FastAPI 서버에서 Todo 삭제 실패');
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('API Route DELETE Error:', error);
    return NextResponse.json({ error: '서버 내부 통신 에러가 발생했습니다.' }, { status: 500 });
  }
}
