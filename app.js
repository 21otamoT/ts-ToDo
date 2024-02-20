var input = document.getElementById('input');
var form = document.getElementById('form');
var removeAllButton = document.getElementById('removeAll');
var tabButtons = document.querySelectorAll('.tab > button');
var uls = document.querySelectorAll('.ul');
var tab = function () {
    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // タブの切り替え
            tabButtons.forEach(function (btn) { return btn.classList.remove('active'); });
            uls.forEach(function (ul) { return ul.classList.remove('active'); });
            btn.classList.add('active');
            var tabId = btn.getAttribute('data-id');
            var tabContent = document.querySelector(".ul#".concat(tabId));
            tabContent.classList.add('active');
            tabContent.innerHTML = '<ul></ul>';
            // ローカルストレージからデータを読み込む
            loadToDos(tabId);
        });
    });
};
var saveData = function (tabId) {
    var ul = document.querySelector(".ul#".concat(tabId, " > ul"));
    var lists = Array.from(ul.querySelectorAll('li'));
    var todos = lists.map(function (list) { return ({
        text: list.innerText,
        completed: list.classList.contains('done')
    }); });
    var storageKey = "todos_".concat(tabId);
    localStorage.setItem(storageKey, JSON.stringify(todos));
};
var loadToDos = function (tabId) {
    var ul = document.querySelector(".ul#".concat(tabId, " > ul"));
    var storageKey = "todos_".concat(tabId);
    var json = localStorage.getItem(storageKey);
    if (json) {
        var todos = JSON.parse(json);
        todos.map(function (todo) {
            var li = document.createElement('li');
            li.innerText = todo.text;
            if (todo.completed)
                li.classList.add('done');
            ul.appendChild(li);
            // クリックで完了
            doneTodo(li, tabId);
            // 右クリックで削除
            remove(li, tabId);
        });
    }
};
var add = function () {
    var todoText = input.value;
    if (!todoText)
        return;
    var activeTab = document.querySelector('.tab > button.active');
    var tabId = activeTab.getAttribute('data-id');
    var ul = document.querySelector(".ul#".concat(tabId, " > ul"));
    var li = document.createElement('li');
    li.innerText = todoText;
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
var doneTodo = function (li, tabId) {
    li.addEventListener('click', function () {
        li.classList.toggle('done');
        saveData(tabId);
    });
};
// 右クリックで削除
var remove = function (li, tabId) {
    li.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        li.remove();
        saveData(tabId);
    });
};
// 全削除
removeAllButton === null || removeAllButton === void 0 ? void 0 : removeAllButton.addEventListener('click', function () {
    if (!confirm('すべて削除します。\nよろしいですか？'))
        return;
    var activeTab = document.querySelector('.tab > button.active');
    var tabId = activeTab.getAttribute('data-id');
    var ul = document.querySelector(".ul#".concat(tabId, " > ul"));
    ul.innerHTML = '';
    localStorage.removeItem("todos_".concat(tabId));
});
// ページ読み込み時にタブを設定
tab();
// ページ読み込み時に各タブのToDoをロード
tabButtons.forEach(function (btn) {
    var tabId = btn.getAttribute('data-id');
    loadToDos(tabId);
});
// フォーム送信時の処理を設定
form.addEventListener('submit', function (e) {
    e.preventDefault();
    add();
});
