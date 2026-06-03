// HTML에서 조작할 DOM 요소 가져오기
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
// 주간 달력 정보를 가져오기
const weeklyCalendar = document.getElementById('weekly-calendar');

// 날짜 관련 DOM 요소 가져오기
const currentDate = document.getElementById('current-date-display');
const prevDateBtn = document.getElementById('prev-date-btn');
const nextDateBtn = document.getElementById('next-date-btn');

// 초기 데이터 로드 - 새로고침 시 로컬스토리지에서 'todos' 키를 가진 문자열 데이터를 가져와 객체 배열
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 현재 수정 중인 id를 나타낼 변수
let editingId = null;

// 현재 선택된 필터 상태
let filter = 'all'; 

// 기본값은 오늘로 설정하여 선택된 날짜를 관리할 Date 객체 생성한다.
let selectedDateObj = new Date();

// 데이터 저장 함수 데이터를 수정할 때마다 변경된 todos 배열을 문자열로 변환하여 로컬스토리지에 저장합니다.
 
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderWeeklyCalendar();
}

// Date 객체를 고유한 날짜 문자열("YYYY-MM-DD" 형태)로 변환하는 함수
function DateToString(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 화면 상단에 현재 선택된 날짜를 보여주는 함수
function updateDate() {
    const year = selectedDateObj.getFullYear();
    const month = selectedDateObj.getMonth() + 1;
    currentDate.textContent = `${year}년 ${month}월`;
}

// 날짜를 이동시키는 네비게이션 함수
function changeDate(offset) {
    selectedDateObj.setDate(selectedDateObj.getDate() + offset);
    updateDate();
    renderWeeklyCalendar();
    renderTodo();
}

// 새로운 Todo 항목을 추가하는 함수
function createTodo() {
    const text = todoInput.value.trim();

    if (text === "") {
        alert('할 일을 입력해주세요.');
        return;
    }

    const currentDateString = DateToString(selectedDateObj);

    // ID 중복 방지: Date.now()를 사용하여 매번 고유한 타임스탬프를 부여
    const newTodo = {
        id: Date.now(), 
        text: text,
        isFinished: false,
        date: currentDateString 
    };

    todos.push(newTodo);
    todoInput.value = '';
    
    // 상태 변경 완료 후 로컬스토리지 저장 및 렌더링
    saveToLocalStorage();
    renderTodo();
}

// Todo 항목의 완료 상태를 변경하는 함수
function statusTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, isFinished: !todo.isFinished };
        }
        return todo;
    });
    
    saveToLocalStorage();
    renderTodo();
}

// 수정 버튼을 누르면 편집하는 상태로 전환하기 
function updateTodo(id) {
    editingId = id; 
    renderTodo(); 
}

// 수정 취소 버튼 클릭하면 수정하기 전 상태로 돌아가야됨
function cancelEdit() {
    editingId = null; 
    renderTodo();
}

// 수정 저장 버튼을 클릭하면, 새로운 텍스트로 바꾸고 갱신해야함
function saveEdit(id) {
    const editInput = document.getElementById(`edit-input-${id}`);
    const newText = editInput.value.trim();

    if (newText === '') {
        alert('수정할 내용을 입력해주세요.');
        return;
    }

    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, text: newText };
        }
        return todo;
    });

    editingId = null; 
    
    // 로컬스토리지 저장 함수 호출 복구
    saveToLocalStorage(); 
    renderTodo();
}

// Todo 항목을 삭제하는 함수
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    
    saveToLocalStorage();
    renderTodo();
}

// 필터 버튼 클릭 이벤트 리스너 설정
filterBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        event.target.classList.add('active');
        filter = event.target.dataset.filter;
        renderTodo();
    });
});

// 데이터를 기반으로 HTML 렌더링을 진행하는 함수
function renderTodo() {
    todoList.innerHTML = '';
    
    const currentDateString = DateToString(selectedDateObj);

    // 날짜와 상태 조건을 모두 만족하는 배열로 필터링
    const filteredTodos = todos.filter(todo => {
        if (todo.date !== currentDateString) return false;
        
        if (filter === 'active') return !todo.isFinished;
        if (filter === 'completed') return todo.isFinished;
        return true; 
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li class="empty-message">해당 날짜에 등록된 할 일이 없습니다.</li>';
        return;
    }

    // 걸러진 배열을 HTML의 li 요소에 추가한다.
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        // 현재 id가 수정 중인 id라면 값을 바꿀 수 있는 수정가능한 창으로 렌더링(진입) 
        if (todo.id === editingId) {
            li.innerHTML = `
                <div class="todo-content">
                    <input type="text" id="edit-input-${todo.id}" class="edit-input" value="${todo.text}">
                </div>
                <div class="todo-actions">
                    <button class="action-btn complete-btn" onclick="saveEdit(${todo.id})">저장</button>
                    <button class="action-btn delete-btn" onclick="cancelEdit()">취소</button>
                </div>
            `;
        } 
        // 수정 중이 아닌 상태라면 기본 상태로 렌더링 하되, isFinished로 완료 여부에 따라 스타일을 적용할 수 있도록 한다.
        else {
            const textClass = todo.isFinished ? 'todo-text finished' : 'todo-text';

            li.innerHTML = `
                <div class="todo-content">
                    <span class="${textClass}">${todo.text}</span>
                </div>
                <div class="todo-actions">
                    <button class="action-btn complete-btn" onclick="statusTodo(${todo.id})">
                        ${todo.isFinished ? '취소' : '완료'}
                    </button>
                    <button class="action-btn edit-btn" onclick="updateTodo(${todo.id})">수정</button>
                    <button class="action-btn delete-btn" onclick="deleteTodo(${todo.id})">삭제</button>
                </div>
            `;
        }

        todoList.appendChild(li);
    });
}

// [추가] 주간 달력을 렌더링하는 함수
function renderWeeklyCalendar() {
    weeklyCalendar.innerHTML = '';

    // 현재 선택된 날짜 기준으로 이번 주 월요일 찾기
    const currentDayOfWeek = selectedDateObj.getDay();
    // 일요일이면 -6일, 그 외는 1을 빼서 월요일을 기준으로 계산
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    const monday = new Date(selectedDateObj);
    monday.setDate(monday.getDate() + diffToMonday);

    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

    // 월요일부터 일요일까지 7번 반복하며 카드 생성
    for (let i = 0; i < 7; i++) {
        const currentLoopDate = new Date(monday);
        currentLoopDate.setDate(monday.getDate() + i);
        
        const dateString = DateToString(currentLoopDate);
        
        // 해당 날짜에 등록된 Todo 개수 구하기
        const count = todos.filter(todo => todo.date === dateString).length;
        
        // 이 카드가 현재 선택된 날짜인지 확인
        const isActive = dateString === DateToString(selectedDateObj);

        const dayCard = document.createElement('div');
        dayCard.className = `day-card ${isActive ? 'active' : ''}`;
        
        // 날짜 카드 innerHTML로 HTML에 추가
        dayCard.innerHTML = `
            <div class="day-name">${dayNames[i]}</div>
            <div class="day-number">${currentLoopDate.getDate()}</div>
            <div class="todo-count">${count > 0 ? `${count}개` : ''}</div>
        `;

        // 카드를 클릭하면 해당 날짜로 이동
        dayCard.addEventListener('click', () => {
            selectedDateObj = new Date(currentLoopDate);
            updateDate();
            renderWeeklyCalendar(); // 달력 상태 갱신
            renderTodo(); // 리스트 갱신
        });

        weeklyCalendar.appendChild(dayCard);
    }
}

// 이벤트 리스너 등록
addBtn.addEventListener('click', createTodo);
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        createTodo();
    }
});

// 이전/다음 날짜 버튼 클릭 시 날짜를 이동시키는 이벤트 리스너 등록
prevDateBtn.addEventListener('click', () => changeDate(-7));
nextDateBtn.addEventListener('click', () => changeDate(7));

//앱 최초 실행 시 상단 날짜판 세팅 및 데이터 로컬스토리지 렌더링 호출
updateDate();
renderWeeklyCalendar();
renderTodo();