import TodoItem from './TodoItem';

export default function TodoList({ todos, onUpdate, onComplete, onDelete }) {
  return (
    <ul className="list-none flex flex-col gap-3">
      {/* 고유한 항목 구분을 위해 index 대신 todo.id를 key prop으로 명시 */}
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}