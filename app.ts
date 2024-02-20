interface ToDo {
  text: string;
  completed: boolean;
}

const input = <HTMLInputElement>document.getElementById('input');
const form = <HTMLElement>document.getElementById('form');
const removeAllButton = <HTMLElement>document.getElementById('removeAll');
const tabButtons = document.querySelectorAll('.tab > button');
const uls = document.querySelectorAll('.ul');

const tab = () => {
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // タブの切り替え
      tabButtons.forEach(btn => btn.classList.remove('active'));
      uls.forEach(ul => ul.classList.remove('active'));

      btn.classList.add('active');

      const tabId = <string>btn.getAttribute('data-id');
      const tabContent = <HTMLElement>document.querySelector(`.ul#${tabId}`);
      tabContent.classList.add('active');
      tabContent.innerHTML = '<ul></ul>';

      // ローカルストレージからデータを読み込む
      loadToDos(tabId);
    });
  });
};

const saveData = (tabId: string) => {
  const ul = <Element>document.querySelector(`.ul#${tabId} > ul`);
  const lists = Array.from(ul.querySelectorAll('li'));
  const todos: ToDo[] = lists.map(list => ({
    text: list.innerText,
    completed: list.classList.contains('done')
  }));

  const storageKey = `todos_${tabId}`;
  localStorage.setItem(storageKey, JSON.stringify(todos));
};

const loadToDos = (tabId: string) => {
  const ul = <Element>document.querySelector(`.ul#${tabId} > ul`);
  const storageKey = `todos_${tabId}`;
  const json = <string>localStorage.getItem(storageKey);

  if(json) {
    const todos: ToDo[] = JSON.parse(json);
    todos.map(todo => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      li.innerText = todo.text;
      li.prepend(checkbox);
      if (todo.completed) li.classList.add('done');
      ul.appendChild(li);

      // クリックで完了
      doneTodo(li, tabId);

      // 右クリックで削除
      remove(li, tabId);
    });
  }
  
};

const add = () => {
  const todoText = input.value;
  if (!todoText) return;

  const activeTab = <Element>document.querySelector('.tab > button.active');
  const tabId = <string>activeTab.getAttribute('data-id');

  const ul = <Element>document.querySelector(`.ul#${tabId} > ul`);

  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  li.innerText = todoText;
  li.prepend(checkbox);

  ul.appendChild(li);
  input.value = '';

  // クリックで完了
  doneTodo(li, tabId);

  // 右クリックで削除
  remove(li, tabId);

  // データの保存
  saveData(tabId);
};

// クリックで完了
const doneTodo = (li:HTMLElement, tabId:string) => {
  li.addEventListener('click', (e) => {
    const checkbox = <HTMLInputElement>document.querySelector('input[type = "checkbox"]');
    if(e.target === checkbox) return;
    checkbox.checked = !checkbox.checked;
    if(checkbox.checked) {
      li.classList.toggle('done');
    }
    else {
      li.classList.remove('done');
    }
    saveData(tabId);
  });
}

// 右クリックで削除
const remove = (li:HTMLElement, tabId:string):void => {
  li.addEventListener('contextmenu', e => {
    e.preventDefault();
    li.remove();
    saveData(tabId);
  });
}

// 全削除
removeAllButton?.addEventListener('click', () => {
  if(!confirm('すべて削除します。\nよろしいですか？')) return;

  const activeTab = <Element>document.querySelector('.tab > button.active');
  const tabId = <string>activeTab.getAttribute('data-id');

  const ul = <Element>document.querySelector(`.ul#${tabId} > ul`);

  ul.innerHTML = '';
  localStorage.removeItem(`todos_${tabId}`);
});

// ページ読み込み時にタブを設定
tab();

// ページ読み込み時に各タブのToDoをロード
tabButtons.forEach(btn => {
  const tabId = <string>btn.getAttribute('data-id');
  loadToDos(tabId);
});

// フォーム送信時の処理を設定
form.addEventListener('submit', e => {
  e.preventDefault();
  add();
});
