var input = document.getElementById('input');
var form = document.getElementById('form');
var json = localStorage.getItem('todos');
var todos = [];
// タブ切り替え
var tab = function () {
    var btns = document.querySelectorAll('.tab > button');
    var uls = document.querySelectorAll('.ul');
    btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            btns.forEach(function (btn) {
                btn.classList.remove('active');
            });
            uls.forEach(function (ul) {
                ul.classList.remove('active');
            });
            btn.classList.add('active');
            var tabId = btn.getAttribute('data-id');
            var tabcontent = document.getElementById(tabId);
            tabcontent.classList.add('active');
        });
    });
};
var saveData = function () {
    var lists = Array.from(document.querySelectorAll('li'));
    var todos = [];
    lists.forEach(function (list) {
        var text = list.innerText;
        var complated = list.classList.contains('done');
        todos.push({ text: text, complated: complated });
    });
    //JSON形式に変換し格納
    localStorage.setItem('todos', JSON.stringify(todos));
};
var add = function (todo) {
    var todoText = input.value;
    var li = document.createElement('li');
    if (todo) {
        todoText = todo.text;
    }
    judge(todoText, li);
    done(li);
    remove(li);
};
//入力が空ではなかったら
var judge = function (todoText, li) {
    var ul = document.querySelector('.ul.active > ul');
    if (todoText) {
        li.innerText = todoText;
        ul.appendChild(li);
        input.value = '';
        saveData();
    }
};
//クリックで完了
var done = function (li) {
    li.addEventListener('click', function () {
        li.classList.toggle('done');
        saveData();
    });
};
//右クリックで削除
var remove = function (li) {
    li.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        li.remove();
        saveData();
    });
};
var removeAll = function () {
    var removeAll = document.getElementById('removeAll');
    removeAll.addEventListener('click', function () {
        var ul = document.querySelector('.ul.active > ul');
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
