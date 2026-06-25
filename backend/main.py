import os
from datetime import date
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional

# 환경변수 가져오기
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB 모델 설정
class Todo(Base):
    __tablename__ = "todos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    is_completed = Column(Boolean, default=False)
    # 수정: 날짜 필드 (기본값은 오늘)
    due_date = Column(String, default=lambda: str(date.today()))

# Pydantic 스키마
class TodoCreate(BaseModel): # 생성
    title: str
    due_date: Optional[str] = None # 생성 시 날짜를 지정할 수 있게 함

class TodoUpdate(BaseModel): # 수정
    title: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[str] = None

class TodoResponse(BaseModel):
    id: int
    title: str
    is_completed: bool
    due_date: str # 응답에 포함시키기

    model_config = {"from_attributes": True}

# 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 8. CRUD 엔드포인트 설정
@app.get("/todos", response_model=List[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()

@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="해당 Todo를 찾을 수 없습니다.")
    return db_todo

@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    # 수정: due_date가 들어오면 사용하고, 없으면 오늘 날짜 사용
    db_todo = Todo(
        title=todo.title, 
        due_date=todo.due_date or str(date.today())
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="해당 Todo를 찾을 수 없습니다.")
    
    if todo.title is not None:
        db_todo.title = todo.title
    if todo.is_completed is not None:
        db_todo.is_completed = todo.is_completed
    if todo.due_date is not None:
        db_todo.due_date = todo.due_date
        
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="해당 Todo를 찾을 수 없습니다.")
    
    db.delete(db_todo)
    db.commit()
    return {"message": "삭제 완료"}