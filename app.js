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
            if (tabId) {
                var tabcontent = document.getElementById(tabId);
                if (tabcontent)
                    tabcontent.classList.add('active');
            }
        });
    });
};
tab();
var input = document.getElementById('input');
var form = document.getElementById('form');
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
    //入力が空ではなかったら
    judge(todoText, li);
    //クリックで完了
    done(li);
    //右クリックで削除
    remove(li);
};
var judge = function (todoText, li) {
    var ul = document.querySelector('.ul.active > ul');
    if (todoText) {
        li.innerText = todoText;
        ul.appendChild(li);
        input.value = '';
        saveData();
    }
};
var done = function (li) {
    li.addEventListener('click', function () {
        li.classList.toggle('done');
        saveData();
    });
};
var remove = function (li) {
    li.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        li.remove();
        saveData();
    });
};
var removeAll = function () {
    var _a;
    (_a = document.getElementById('removeAll')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        var ul = document.querySelector('.ul.active > ul');
        ul.innerHTML = '';
        saveData();
    });
};
removeAll();
//ToDoリストを追加
form.addEventListener('submit', function (e) {
    e.preventDefault();
    add();
});
var json = localStorage.getItem('todos');
var todos = [];
if (json !== null) {
    todos = JSON.parse(json);
}
if (todos) {
    todos.forEach(function (todo) {
        add(todo);
    });
}
