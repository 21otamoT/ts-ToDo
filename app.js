var input = document.getElementById('input');
var form = document.getElementById('form');
var todos = [];
// タブごとのキーを生成する関数
var generateStorageKey = function (tabId) {
    return "todos_".concat(tabId);
};
var saveData = function (tabId) {
    var lists = Array.from(document.querySelectorAll('.ul.active > ul > li'));
    var todos = [];
    lists.forEach(function (list) {
        var text = list.innerHTML;
        var complated = list.classList.contains('done');
        todos.push({ text: text, complated: complated });
    });
    //JSON形式に変換し格納
    localStorage.setItem(generateStorageKey(tabId), JSON.stringify(todos));
};
var add = function (tabId, todo) {
    var todoText = input.value;
    var li = document.createElement('li');
    if (todo) {
        todoText = todo.text;
    }
    //入力が空ではなかったら
    judge(todoText, li, tabId);
    //クリックで完了
    done(li, tabId);
    //右クリックで削除
    remove(li, tabId);
};
var judge = function (todoText, li, tabId) {
    var ul = document.querySelector('.ul.active > ul');
    if (todoText) {
        li.innerText = todoText;
        ul.appendChild(li);
        input.value = '';
        saveData(tabId);
    }
};
var done = function (li, tabId) {
    li.addEventListener('click', function () {
        li.classList.toggle('done');
        saveData(tabId);
    });
};
var remove = function (li, tabId) {
    li.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        li.remove();
        saveData(tabId);
    });
};
var removeAll = function (tabId) {
    var _a;
    (_a = document.getElementById('removeAll')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        var ul = document.querySelector('.ul.active > ul');
        ul.innerHTML = '';
        saveData(tabId);
    });
};
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
            //ToDoリストを追加
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                add(tabId);
            });
            if (todos) {
                todos.forEach(function (todo) {
                    add(tabId, todo);
                });
            }
            removeAll(tabId);
        });
    });
};
tab();
