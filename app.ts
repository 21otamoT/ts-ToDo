interface ToDos {
  text: string,
  complated: boolean
}

const input = <HTMLInputElement>document.getElementById('input');
const form = <HTMLElement>document.getElementById('form');
const json = <string>localStorage.getItem('todos');
let todos = [];

// タブ切り替え
const tab = () => {
  const btns = document.querySelectorAll('.tab > button');
  const uls = document.querySelectorAll('.ul');
  btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
          btns.forEach(function (btn) {
              btn.classList.remove('active');
          });

          uls.forEach(function (ul) {
              ul.classList.remove('active');
          });

          btn.classList.add('active');

          let tabId = <string>btn.getAttribute('data-id');

          const tabcontent = <HTMLElement>document.getElementById(tabId);
          tabcontent.classList.add('active');
      });
  });
};

const saveData = () => {
  const lists = Array.from(document.querySelectorAll('li'));
  const todos: ToDos[] = [];

  lists.forEach(function (list) {
      const text = list.innerText;
      const complated = list.classList.contains('done');
      todos.push({ text: text, complated: complated });
  });
  
  //JSON形式に変換し格納
  localStorage.setItem('todos', JSON.stringify(todos));
};

const add = (todo?:ToDos):void => {
  let todoText = input.value;
  const li = document.createElement('li');

  if (todo) {
      todoText = todo.text;
  }

  judge(todoText, li);

  done(li);

  remove(li);
};

//入力が空ではなかったら
const judge = (todoText:string, li:HTMLElement):void => {
  const ul = <Element>document.querySelector('.ul.active > ul');
  if (todoText) {
      li.innerText = todoText;
      ul.appendChild(li);
      input.value = '';
      saveData();
  }
};

//クリックで完了
const done = (li:HTMLElement):void => {
  li.addEventListener('click', function () {
      li.classList.toggle('done');
      saveData();
  });
};

//右クリックで削除
const remove = (li:HTMLElement):void => {
  li.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      li.remove();
      saveData();
  });
};

const removeAll = () => {
  const removeAll = <HTMLElement>document.getElementById('removeAll');
  
    removeAll.addEventListener('click', function () {
      var ul = <Element>document.querySelector('.ul.active > ul');
      ul.innerHTML = '';
      saveData();
  });
};

//ToDoリストを追加
form.addEventListener('submit', function (e) {
  e.preventDefault();
  add();
});

todos = JSON.parse(json);

if (todos) {
  todos.forEach(function (todo) {
      add(todo);
  });
}

removeAll();
tab();
