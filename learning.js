var courses = {
    begin: [
        {
            title: "低空经济是什么？5 分钟入门",
            desc: "用通俗语言讲清楚低空经济的概念、应用场景和发展现状，完全零基础也能看懂",
            tags: ["科普", "入门"],
            time: "5 min"
        },
        {
            title: "无人机基础知识图解",
            desc: "图文并茂讲解无人机的组成结构、飞行原理和主流分类，不需要任何技术背景",
            tags: ["无人机", "图解"],
            time: "20 min"
        },
        {
            title: "我国低空经济政策梳理",
            desc: "整理近年来国家和地方出台的低空经济相关政策法规，帮助了解行业大方向",
            tags: ["政策", "行业"],
            time: "15 min"
        },
        {
            title: "飞手执照是什么？怎么考？",
            desc: "CAAC / AOPA 无人机飞手执照的考试流程、科目内容和备考技巧全攻略",
            tags: ["执照", "备考"],
            time: "30 min"
        }
    ],
    mid: [
        {
            title: "无人机操控技术进阶",
            desc: "系统学习飞行操控技巧、航线规划和任务执行流程，适合已有基础的学员",
            tags: ["操控", "技术"],
            time: "2 h"
        },
        {
            title: "低空空域管理实务",
            desc: "掌握空域申请流程、飞行计划制定、以及实际作业中的安全规范要点",
            tags: ["空域", "实务"],
            time: "1.5 h"
        },
        {
            title: "行业应用案例深度解析",
            desc: "深入解析电力巡检、农业植保、应急救援等典型无人机应用场景的实际案例",
            tags: ["案例", "行业"],
            time: "1 h"
        },
        {
            title: "无人机航拍与数据处理",
            desc: "学习航拍构图、航测数据处理和三维建模基本流程，了解主流工具的使用方法",
            tags: ["航拍", "数据"],
            time: "2 h"
        }
    ],
    adv: [
        {
            title: "UTC / AOPA 工程师认证备考",
            desc: "面向无人机工程师等级认证的系统复习材料和历年真题解析，冲刺高分必备",
            tags: ["认证", "工程师"],
            time: "20 h"
        },
        {
            title: "低空经济商业模式分析",
            desc: "从创业和投资视角分析低空经济的商业逻辑、市场机会与竞争格局",
            tags: ["商业", "战略"],
            time: "3 h"
        },
        {
            title: "无人机集群与自主控制前沿",
            desc: "了解无人机编队控制、集群调度算法和国际前沿研究方向，拓展技术视野",
            tags: ["前沿", "算法"],
            time: "2 h"
        },
        {
            title: "低空经济项目实战模拟",
            desc: "模拟真实项目场景，完整走一遍从需求分析、方案设计到落地交付的项目流程",
            tags: ["实战", "项目"],
            time: "10 h"
        }
    ]
};

function getRecLevel(score) {
    if (score >= 8) return "adv";
    if (score >= 5) return "mid";
    return "begin";
}

window.onload = function () {
    var score = parseInt(localStorage.getItem("score")) || 0;
    var recLevel = getRecLevel(score);

    if (score) {
        var levelName = recLevel === "adv" ? "进阶认证" : recLevel === "mid" ? "技能提升" : "入门基础";
        document.getElementById("learningIntro").textContent =
            "你的测评得分为 " + score + " / 10，当前推荐重点学习「" + levelName + "」阶段内容，加粗边框标注的就是";
        document.getElementById("learningLevelTag").innerHTML =
            '<span class="course-rec-tag">重点推荐：' + levelName + '</span>';
    } else {
        document.getElementById("learningIntro").textContent =
            "还没做过测评？先去做一下，系统会根据结果帮你标出最适合的学习阶段～";
        document.getElementById("learningLevelTag").innerHTML =
            '<a href="test.html" class="btn" style="display:inline-block;padding:8px 20px;font-size:13px;margin-top:8px">去做测评</a>';
    }

    renderSection("sectionBegin", courses.begin, score > 0 && recLevel === "begin");
    renderSection("sectionMid",   courses.mid,   score > 0 && recLevel === "mid");
    renderSection("sectionAdv",   courses.adv,   score > 0 && recLevel === "adv");
};

function renderSection(id, list, isRec) {
    var html = "";
    list.forEach(function (c) {
        var recBadge = isRec ? '<span class="course-rec-badge">推荐</span>' : "";
        var tagsHtml = c.tags.map(function (t) {
            return '<span class="course-tag">' + t + '</span>';
        }).join("");
        html += '<div class="course-card' + (isRec ? " course-card-rec" : "") + '">'
            + '<div class="course-card-top">'
            + '<h4 class="course-title">' + c.title + recBadge + '</h4>'
            + '<span class="course-time">' + c.time + '</span>'
            + '</div>'
            + '<p class="course-desc">' + c.desc + '</p>'
            + '<div class="course-tags">' + tagsHtml + '</div>'
            + '</div>';
    });
    document.getElementById(id).innerHTML = html;
}
