interface Todos {
  text: string,
  complated: boolean
}

const input = <HTMLInputElement>document.getElementById('input');
const form = <HTMLElement>document.getElementById('form');
let todos: Todos[] = [];

// タブごとのキーを生成する関数
const generateStorageKey = (tabId:string|undefined):string => {
  return `todos_${tabId}`;
};

const saveData = (tabId:string|undefined):void => {
  const lists = Array.from(document.querySelectorAll('.ul.active > ul > li'));
  let todos: Todos[] = [];

  lists.forEach((list) => {
    const text = list.innerHTML;
    const complated = <boolean>list.classList.contains('done');
    todos.push({text, complated});
  });
  //JSON形式に変換し格納
  localStorage.setItem(generateStorageKey(tabId), JSON.stringify(todos));
}

const add = (tabId:string, todo?:Todos):void => {  
  let todoText:string = input.value;
  const li:HTMLElement = document.createElement('li');
  
  if(todo) {
    todoText = todo.text;
  }

  //入力が空ではなかったら
  judge(todoText, li, tabId);
  
  //クリックで完了
  done(li, tabId);

  //右クリックで削除
  remove(li, tabId);
}

const judge = (todoText:string, li:HTMLElement, tabId:string):void => {
  let ul = <HTMLElement>document.querySelector('.ul.active > ul');
  if(todoText) {  
    li.innerText = todoText;
    ul.appendChild(li);
    input.value = '';
    saveData(tabId);
  }
}

const done = (li:HTMLElement, tabId:string):void => {
  li.addEventListener('click', function():void {
    li.classList.toggle('done');
    saveData(tabId);
  });
}

const remove = (li:HTMLElement, tabId:string):void => {
  li.addEventListener('contextmenu', function(e):void {
    e.preventDefault();
    li.remove();
    saveData(tabId);
  });
}

const removeAll = (tabId:string):void => {
  document.getElementById('removeAll')?.addEventListener('click', function():void {
    let ul = <HTMLElement>document.querySelector('.ul.active > ul');
    ul.innerHTML = ''
    saveData(tabId);
  });
}

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
      
      const tabId = <string>btn.getAttribute('data-id');

      const tabcontent = <HTMLElement>document.getElementById(tabId);

      tabcontent.classList.add('active');

      //ToDoリストを追加
      form.addEventListener('submit', (e):void => {
        e.preventDefault();
        add(tabId);
      });

      if(todos) {
        todos.forEach(todo => {
          add(tabId, todo);
        });
      }

      removeAll(tabId);
    });
  });
}

tab();
