// タブ切り替え
const tab = ():void => {
  const btns = document.querySelectorAll('.tab > button');
  const uls = document.querySelectorAll('.ul');

  btns.forEach(btn => {
    btn.addEventListener('click', function(){

      btns.forEach(btn => {
        btn.classList.remove('active');
      });

      uls.forEach(ul => {
        ul.classList.remove('active');
      });

      btn.classList.add('active');
      
      const tabId = btn.getAttribute('data-id');
      if(tabId) {
        const tabcontent = document.getElementById(tabId);

        if(tabcontent) tabcontent.classList.add('active');
      }
    });
  });
}
tab();

const input = <HTMLInputElement>document.getElementById('input');
const form = <HTMLElement>document.getElementById('form');

interface Todos {
  text: string,
  complated: boolean
}

const saveData = ():void => {
  const lists = Array.from(document.querySelectorAll('li'));
  let todos: Todos[] = [];

  lists.forEach((list) => {
    const text = list.innerText;
    const complated = <boolean>list.classList.contains('done');
    todos.push({text, complated});
  });
  //JSON形式に変換し格納
  localStorage.setItem('todos', JSON.stringify(todos));
}

const add = (todo?:Todos):void => {  
  let todoText:string = input.value;
  const li:HTMLElement = document.createElement('li');
  
  if(todo) {
    todoText = todo.text;
  }

  //入力が空ではなかったら
  judge(todoText, li);
  
  //クリックで完了
  done(li);

  //右クリックで削除
  remove(li);
}

const judge = (todoText:string, li:HTMLElement):void => {
  let ul = <HTMLElement>document.querySelector('.ul.active > ul');
  if(todoText) {  
    li.innerText = todoText;
    ul.appendChild(li);
    input.value = '';
    saveData();
  }
}

const done = (li:HTMLElement):void => {
  li.addEventListener('click', function():void {
    li.classList.toggle('done');
    saveData();
  });
}

const remove = (li:HTMLElement):void => {
  li.addEventListener('contextmenu', function(e):void {
    e.preventDefault();
    li.remove();
    saveData();
  });
}

const removeAll = () => {
  document.getElementById('removeAll')?.addEventListener('click', function():void {
    let ul = <HTMLElement>document.querySelector('.ul.active > ul');
    ul.innerHTML = ''
    saveData();
  });
}

removeAll();

//ToDoリストを追加
form.addEventListener('submit', (e):void => {
  e.preventDefault();
  add();
});

const json = localStorage.getItem('todos');

let todos: Todos[] = [];

if(json !== null) {
  todos = JSON.parse(json);
}

if(todos) {
  todos.forEach(todo => {
    add(todo);
  });
}