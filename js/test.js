var questions = [
    { q: "你是否清晰解释低空经济的基本概念。", name: "A1", dim: "A" },
    { q: "你是否了解低空经济的主要应用场景（如无人机物流、巡检、应急救援、城市空中交通等）。", name: "A2", dim: "A" },
    { q: "你是否知道低空经济领域有哪些典型的职业岗位（如飞手、工程师、运营、数据分析等）。", name: "A3", dim: "A" },
    { q: "你是否关注低空经济相关政策和行业动态。", name: "A4", dim: "A" },
    { q: "你是否具备无人机、航空或相关领域的基础知识。", name: "B1", dim: "B" },
    { q: "你是否了解低空经济涉及的主要技术（如导航、通信、传感器等）。", name: "B2", dim: "B" },
    { q: "你是否熟悉低空经济相关的法律法规基本框架。", name: "B3", dim: "B" },
    { q: "你是否能用专业术语描述低空经济的一个应用案例。", name: "B4", dim: "B" },
    { q: "你是否能使用数据分析工具（如Excel）处理简单数据。", name: "C1", dim: "C" },
    { q: "你是否能理解基础的技术原理（如飞行控制、数据传输等）。", name: "C2", dim: "C" },
    { q: "你是否能通过查阅资料解决简单的技术操作问题。", name: "C3", dim: "C" },
    { q: "你是否了解至少一种与低空经济相关的软件或平台。", name: "C4", dim: "C" },
    { q: "你是否能通过自学快速掌握一项新技能。", name: "D1", dim: "D" },
    { q: "你是否习惯查阅资料、观看教程来学习新知识。", name: "D2", dim: "D" },
    { q: "你是否能总结学习内容，形成自己的知识体系。", name: "D3", dim: "D" },
    { q: "你是否愿意投入时间学习低空经济相关的新技术。", name: "D4", dim: "D" },
    { q: "你是否对无人机物流、巡检、测绘等方向的工作感兴趣。", name: "E1", dim: "E" },
    { q: "你是否希望能从事与低空经济相关的技术或管理岗位。", name: "E2", dim: "E" },
    { q: "你是否喜欢研究新兴行业，愿意尝试低空经济相关的新领域。", name: "E3", dim: "E" },
    { q: "低空经济的发展前景是否让你有动力学习相关技能。", name: "E4", dim: "E" }
];

var current = 0;
var answers = {};

window.onload = function () { renderQuestion(); };

function renderQuestion() {
    var q = questions[current];
    var total = questions.length;

    document.getElementById("progressFill").style.width = (current / total * 100) + "%";
    document.getElementById("progressText").textContent = "第 " + (current + 1) + " / " + total + " 题";
    document.getElementById("questionText").textContent = (current + 1) + ".  " + q.q;

    var options = ["完全不符合", "不太符合", "一般", "比较符合", "完全符合"];
    var html = "";
    for (var i = 1; i <= 5; i++) {
        var sel = answers[q.name] === i ? " selected" : "";
        html += '<div class="option-btn' + sel + '" onclick="selectOption(this, \'' + q.name + '\', ' + i + ')">' + options[i-1] + '</div>';
    }
    document.getElementById("optionsWrap").innerHTML = html;

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

async function submitTest() {
    if (!answers[questions[current].name]) {
        showTip("请先选择一个选项～");
        return;
    }
    var dims = {A:0, B:0, C:0, D:0, E:0};
    questions.forEach(function (item) {
        dims[item.dim] += answers[item.name] || 1;
    });
    var total = dims.A + dims.B + dims.C + dims.D + dims.E;
    var score = Math.max(20, Math.min(100, total));

    var userId = localStorage.getItem('userId');
    if (userId) {
        try {
            await fetch('http://localhost:8080/api/assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, answers: answers, dimensions: dims, score: score })
            });
        } catch (e) {}
    }

    localStorage.setItem("score", score);
    localStorage.setItem("dimensions", JSON.stringify(dims));
    window.location.href = "result.html";
}

function showTip(msg) {
    var tip = document.getElementById("tipMsg");
    tip.textContent = msg;
    tip.style.opacity = "1";
    setTimeout(function () { tip.style.opacity = "0"; }, 2000);
}
