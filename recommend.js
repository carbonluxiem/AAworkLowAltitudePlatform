window.onload = function () { initProfile(); };

function initProfile() {
    var score = parseInt(localStorage.getItem("score")) || 5;

    // 日期
    var now = new Date();
    document.getElementById("testDate").textContent =
        now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日";
    document.getElementById("testScore").textContent = score;

    // 人才等级
    var level = getLevel(score);
    document.getElementById("levelTitle").textContent = level.title;
    document.getElementById("levelDesc").textContent = level.desc;
    document.getElementById("levelBadge").className = "level-badge level-" + level.type;

    // 能力维度
    var dims = calcDimensions(score);

    // 雷达图
    drawRadar(
        document.getElementById("radarChart"),
        dims.map(function (d) { return d.value; }),
        dims.map(function (d) { return d.name; })
    );

    // 维度条形图
    renderDimBars(dims);

    // 职业匹配
    renderCareers(calcCareers(score));

    // 技能标签
    renderTags(getSkillTags(score));

    // 发展建议
    renderSuggestions(getSuggestions(score));
}

/*  数据计算  */

function getLevel(score) {
    if (score >= 8) return { title: "高潜力人才", desc: "技术能力突出，具备快速成长潜力", type: "gold" };
    if (score >= 5) return { title: "发展型人才", desc: "基础较好，持续学习可实现突破", type: "silver" };
    return { title: "基础型人才", desc: "初入行业，建议系统培养提升", type: "bronze" };
}

function calcDimensions(score) {
    // score 范围 2-10，各维度值映射至 0-100
    return [
        { name: "技术理解力", value: clamp(score * 9 + 2,  10, 95) },
        { name: "实操经验值", value: clamp(score * 8 - 2,  10, 95) },
        { name: "学习成长力", value: clamp(score * 7 + 10, 15, 95) },
        { name: "行业认知度", value: clamp(Math.round(score * 8.5), 10, 95) },
        { name: "团队协作力", value: clamp(score * 5 + 30, 30, 95) },
        { name: "安全规范性", value: clamp(score * 4 + 42, 40, 95) },
    ];
}

function calcCareers(score) {
    var list = [
        { name: "无人机巡检工程师", icon: "✈", match: clamp(score * 9 - 2,  10, 95), desc: "负责无人机设备维护与巡检作业，技术要求较高" },
        { name: "低空物流运营专员", icon: "📦", match: clamp(score * 6 + 30, 25, 95), desc: "协调低空物流网络，管理无人机配送全流程" },
        { name: "应急救援无人机操手", icon: "🚁", match: clamp(score * 6 + 20, 20, 95), desc: "应急响应场景下精准操控无人机开展救援作业" },
        { name: "无人机农业植保员",  icon: "🌾", match: clamp(score * 4 + 40, 35, 95), desc: "农业场景植保飞防作业，入门门槛相对较低" },
        { name: "低空经济咨询顾问",  icon: "💼", match: clamp(score * 7 + 15, 15, 95), desc: "为企业提供低空经济业务规划与战略咨询服务" },
    ];
    list.sort(function (a, b) { return b.match - a.match; });
    return list;
}

function getSkillTags(score) {
    if (score >= 8) {
        return [
            { text: "技术能力强",   color: "blue"   },
            { text: "学习力优秀",   color: "blue"   },
            { text: "适合工程岗位", color: "green"  },
            { text: "创新思维",     color: "purple" },
            { text: "快速成长",     color: "green"  },
            { text: "无人机技术",   color: "blue"   },
            { text: "低空经济",     color: "gray"   },
        ];
    } else if (score >= 5) {
        return [
            { text: "基础扎实",     color: "blue"   },
            { text: "学习积极",     color: "green"  },
            { text: "适合运营岗位", color: "blue"   },
            { text: "有上升空间",   color: "purple" },
            { text: "行业新秀",     color: "green"  },
            { text: "低空经济",     color: "gray"   },
        ];
    } else {
        return [
            { text: "热情高涨",     color: "green"  },
            { text: "潜力待挖掘",   color: "purple" },
            { text: "适合基础岗位", color: "blue"   },
            { text: "建议系统学习", color: "orange" },
            { text: "低空经济入门", color: "gray"   },
        ];
    }
}

function getSuggestions(score) {
    if (score >= 8) {
        return [
            { icon: "🎓", title: "考取专业认证",   desc: "参加无人机工程师 AOPA/UTC 认证培训，提升专业资质与市场竞争力" },
            { icon: "💡", title: "技术实践项目",   desc: "申请低空经济企业实习或参与实际飞行项目，积累真实工程经验" },
            { icon: "🌐", title: "关注前沿动态",   desc: "持续跟踪低空经济政策法规与技术演进，保持高度行业敏感度" },
            { icon: "🤝", title: "拓展行业人脉",   desc: "参与行业论坛、技术社群及产学研交流，构建低空经济专业网络" },
        ];
    } else if (score >= 5) {
        return [
            { icon: "📚", title: "系统理论学习",   desc: "系统学习无人机基础理论、低空空域管理等核心知识体系" },
            { icon: "✈",  title: "取得飞手执照",   desc: "备考民用无人机飞手执照（CAAC/AOPA），提升职业竞争力" },
            { icon: "🔧", title: "参加实操培训",   desc: "报名低空经济行业实操培训课程，积累实际设备操作经验" },
            { icon: "📈", title: "制定提升计划",   desc: "设定 3-6 个月学习目标，有针对性地强化薄弱能力维度" },
        ];
    } else {
        return [
            { icon: "🌱", title: "夯实基础知识",   desc: "从零学习低空经济基础知识，深入了解无人机工作原理与应用场景" },
            { icon: "🎬", title: "入门视频教程",   desc: "观看无人机操作入门系列视频，建立感性认知并激发学习兴趣" },
            { icon: "🏫", title: "线下体验课程",   desc: "参加线下体验飞行课程，亲身感受低空经济行业的独特魅力" },
            { icon: "📋", title: "制定学习规划",   desc: "制定系统化 6-12 个月学习规划，逐步提升各项综合能力指标" },
        ];
    }
}

/*  Canvas 雷达图  */

function drawRadar(canvas, values, labels) {
    var ctx = canvas.getContext("2d");
    var w = canvas.width, h = canvas.height;
    var cx = w / 2, cy = h / 2 + 8;
    var radius = 95;
    var n = values.length;
    var levels = 5;

    ctx.clearRect(0, 0, w, h);

    // 背景网格
    for (var lv = 1; lv <= levels; lv++) {
        var r = radius * lv / levels;
        ctx.beginPath();
        for (var i = 0; i < n; i++) {
            var angle = i * 2 * Math.PI / n - Math.PI / 2;
            var x = cx + r * Math.cos(angle);
            var y = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = lv === levels ? "#bbb" : "#ddd";
        ctx.lineWidth = lv === levels ? 1.5 : 1;
        ctx.stroke();
        if (lv === levels) {
            ctx.fillStyle = "rgba(240,240,240,0.4)";
            ctx.fill();
        }
    }

    // 轴线
    for (var i = 0; i < n; i++) {
        var angle = i * 2 * Math.PI / n - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // 数据多边形
    ctx.beginPath();
    for (var i = 0; i < n; i++) {
        var angle = i * 2 * Math.PI / n - Math.PI / 2;
        var r = radius * values[i] / 100;
        var x = cx + r * Math.cos(angle);
        var y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fill();
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 数据点
    for (var i = 0; i < n; i++) {
        var angle = i * 2 * Math.PI / n - Math.PI / 2;
        var r = radius * values[i] / 100;
        var x = cx + r * Math.cos(angle);
        var y = cy + r * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = "#111";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // 标签
    for (var i = 0; i < n; i++) {
        var angle = i * 2 * Math.PI / n - Math.PI / 2;
        var labelR = radius + 22;
        var x = cx + labelR * Math.cos(angle);
        var y = cy + labelR * Math.sin(angle);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 12px 'Segoe UI', Arial";
        ctx.fillStyle = "#111";
        ctx.fillText(labels[i], x, y - 8);

        ctx.font = "11px 'Segoe UI', Arial";
        ctx.fillStyle = "#555";
        ctx.fillText(Math.round(values[i]) + "%", x, y + 8);
    }
}

/*  渲染 */

function renderDimBars(dims) {
    var html = "";
    dims.forEach(function (d) {
        var color = d.value >= 75 ? "#111"
                  : d.value >= 50 ? "#444"
                  : d.value >= 30 ? "#888"
                  : "#bbb";
        html += '<div class="dim-item">'
            + '<div class="dim-label"><span>' + d.name + '</span>'
            + '<span class="dim-val" style="color:' + color + '">' + d.value + '%</span></div>'
            + '<div class="dim-bar-bg"><div class="dim-bar-fill" style="width:' + d.value + '%;background:' + color + '"></div></div>'
            + '</div>';
    });
    document.getElementById("dimBars").innerHTML = html;
}

function renderCareers(careers) {
    var html = "";
    careers.forEach(function (c) {
        var cls = c.match >= 75 ? "match-high" : c.match >= 50 ? "match-mid" : "match-low";
        var label = c.match >= 75 ? "高度匹配" : c.match >= 50 ? "较为匹配" : "基础匹配";
        html += '<div class="career-item">'
            + '<div class="career-top">'
            + '<span class="career-icon">' + c.icon + '</span>'
            + '<span class="career-name">' + c.name + '</span>'
            + '<span class="career-badge ' + cls + '">' + label + ' ' + c.match + '%</span>'
            + '</div>'
            + '<div class="career-bar-bg"><div class="career-bar-fill ' + cls + '" style="width:' + c.match + '%"></div></div>'
            + '<p class="career-desc">' + c.desc + '</p>'
            + '</div>';
    });
    document.getElementById("careerList").innerHTML = html;
}

function renderTags(tags) {
    var html = "";
    tags.forEach(function (t) {
        html += '<span class="skill-tag tag-' + t.color + '">' + t.text + '</span>';
    });
    document.getElementById("skillTags").innerHTML = html;
}

function renderSuggestions(suggestions) {
    var html = "";
    suggestions.forEach(function (s) {
        html += '<div class="suggest-item">'
            + '<div class="suggest-icon">' + s.icon + '</div>'
            + '<div class="suggest-body">'
            + '<h4 class="suggest-title">' + s.title + '</h4>'
            + '<p class="suggest-desc">' + s.desc + '</p>'
            + '</div></div>';
    });
    document.getElementById("suggestions").innerHTML = html;
}

/*  工具函数  */

function clamp(val, min, max) {
    return Math.min(max, Math.max(min, Math.round(val)));
}
