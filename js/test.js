var questions = [
    {
        q: "你对无人机技术的了解程度？",
        name: "q1",
        options: [
            { label: "比较熟悉，了解基本原理和操作方式", value: 5 },
            { label: "有所了解，知道个大概但不深入", value: 3 },
            { label: "基本没怎么接触过", value: 1 }
        ]
    },
    {
        q: "你是否有动手实操或技术学习的经历？",
        name: "q2",
        options: [
            { label: "有，做过相关项目或参加过培训课程", value: 5 },
            { label: "自己摸索过一些，但不太系统", value: 3 },
            { label: "还没有，目前都是理论层面", value: 1 }
        ]
    },
    {
        q: "你平时对低空经济行业动态的关注度？",
        name: "q3",
        options: [
            { label: "经常关注，了解最新政策和行业新闻", value: 5 },
            { label: "偶尔看到了解一下，不太主动", value: 3 },
            { label: "基本没关注过这个领域", value: 1 }
        ]
    },
    {
        q: "遇到不懂的技术问题，你通常会怎么做？",
        name: "q4",
        options: [
            { label: "查文档、搜资料，直到搞明白为止", value: 5 },
            { label: "找人问一问，了解个大概就行", value: 3 },
            { label: "先放一放，觉得以后再说", value: 1 }
        ]
    },
    {
        q: "你的理工科基础（数学、物理、编程等）如何？",
        name: "q5",
        options: [
            { label: "基础比较扎实，学得还不错", value: 5 },
            { label: "还可以，不算强但也过得去", value: 3 },
            { label: "不太好，比较薄弱", value: 1 }
        ]
    },
    {
        q: "你是否了解无人机飞行相关的安全规范？",
        name: "q6",
        options: [
            { label: "了解，知道主要规定和注意事项", value: 5 },
            { label: "听说过一些，但不清楚细节", value: 3 },
            { label: "完全不了解", value: 1 }
        ]
    },
    {
        q: "你更倾向于哪种工作方式？",
        name: "q7",
        options: [
            { label: "户外 + 技术操作类，喜欢在一线干活", value: 5 },
            { label: "内外结合，什么都能接受", value: 3 },
            { label: "偏室内规划 / 分析类工作", value: 1 }
        ]
    },
    {
        q: "你希望在低空经济领域从事哪类方向？",
        name: "q8",
        options: [
            { label: "技术方向，飞行操控或工程维护", value: 5 },
            { label: "运营方向，物流调度或项目管理", value: 3 },
            { label: "还没想清楚，想先了解了解", value: 1 }
        ]
    }
];

var current = 0;
var answers = {};

window.onload = function () { renderQuestion(); };

function renderQuestion() {
    var q = questions[current];
    var total = questions.length;

    // 进度条
    document.getElementById("progressFill").style.width = (current / total * 100) + "%";
    document.getElementById("progressText").textContent = "第 " + (current + 1) + " / " + total + " 题";

    // 题目
    document.getElementById("questionText").textContent = (current + 1) + ".  " + q.q;

    // 选项
    var html = "";
    q.options.forEach(function (opt) {
        var sel = answers[q.name] === opt.value ? " selected" : "";
        html += '<div class="option-btn' + sel + '" onclick="selectOption(this, \'' + q.name + '\', ' + opt.value + ')">'
            + opt.label + '</div>';
    });
    document.getElementById("optionsWrap").innerHTML = html;

    // 按钮
    document.getElementById("btnPrev").style.visibility = current === 0 ? "hidden" : "visible";
    var isLast = current === total - 1;
    var btnNext = document.getElementById("btnNext");
    btnNext.textContent = isLast ? "提交测评" : "下一题";
    btnNext.onclick = isLast ? submitTest : nextQuestion;
}

function selectOption(el, name, value) {
    var btns = document.getElementById("optionsWrap").querySelectorAll(".option-btn");
    btns.forEach(function (b) { b.classList.remove("selected"); });
    el.classList.add("selected");
    answers[name] = value;
}

function nextQuestion() {
    if (!answers[questions[current].name]) {
        showTip("请先选择一个选项～");
        return;
    }
    current++;
    renderQuestion();
}

function prevQuestion() {
    if (current > 0) {
        current--;
        renderQuestion();
    }
}

function submitTest() {
    if (!answers[questions[current].name]) {
        showTip("请先选择一个选项～");
        return;
    }
    var total = 0;
    questions.forEach(function (item) {
        total += answers[item.name] || 1;
    });
    // 8 题，每题 1/3/5，满分 40，最低 8 → 映射至 2-10
    var score = Math.max(2, Math.min(10, Math.round(total / 4)));
    localStorage.setItem("score", score);
    window.location.href = "result.html";
}

function showTip(msg) {
    var tip = document.getElementById("tipMsg");
    tip.textContent = msg;
    tip.style.opacity = "1";
    setTimeout(function () { tip.style.opacity = "0"; }, 2000);
}
