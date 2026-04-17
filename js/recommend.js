window.onload = function () { loadProfile(); };

async function loadProfile() {
    var score = parseInt(localStorage.getItem("score")) || 50;
    var dimsStr = localStorage.getItem("dimensions");
    var dims = dimsStr ? JSON.parse(dimsStr) : {A:10, B:10, C:10, D:10, E:10};
    var userId = localStorage.getItem("userId");
    var profile = null;

    if (userId) {
        try {
            var res = await fetch('http://localhost:8080/api/profile/' + encodeURIComponent(userId));
            if (res.ok) {
                profile = await res.json();
                score = profile.score || score;
                dims = profile.dimensions || dims;
            }
        } catch (e) {}
    }

    document.getElementById("testDate").textContent = (profile && profile.assessmentDate) || new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日";
    document.getElementById("testScore").textContent = score;

    var level = getLevel(score);
    document.getElementById("levelTitle").textContent = (profile && profile.level) || level.title;
    document.getElementById("levelDesc").textContent = level.desc;
    document.getElementById("levelBadge").className = "level-badge level-" + level.type;

    var dimArray = calcDimensions(dims);
    drawRadar(
        document.getElementById("radarChart"),
        dimArray.map(function (d) { return d.value; }),
        dimArray.map(function (d) { return d.name; })
    );
    renderDimBars(dimArray);

    if (userId) {
        try {
            var jobRes = await fetch('http://localhost:8080/api/jobs?userId=' + encodeURIComponent(userId));
            if (jobRes.ok) {
                var jobs = await jobRes.json();
                renderCareers(jobs);
            } else {
                renderCareers(calcCareers(dims));
            }
        } catch (e) {
            renderCareers(calcCareers(dims));
        }
    } else {
        renderCareers(calcCareers(dims));
    }

    if (profile && profile.tags) {
        renderTags(profile.tags);
    } else {
        renderTags(getSkillTags(score));
    }

    if (profile && profile.suggestions) {
        renderSuggestions(profile.suggestions);
    } else {
        renderSuggestions(getSuggestions(dims));
    }
}

/*  数据计算  */

function getLevel(score) {
    if (score >= 80) return { title: "优秀", desc: "能力突出，具备行业竞争力", type: "gold" };
    if (score >= 60) return { title: "良好", desc: "基础扎实，持续提升可突破", type: "silver" };
    if (score >= 40) return { title: "中等", desc: "有一定基础，需系统学习", type: "bronze" };
    return { title: "待提升", desc: "建议从基础开始系统培养", type: "bronze" };
}

function calcDimensions(dims) {
    return [
        { name: "行业认知", value: Math.round(dims.A * 5) },
        { name: "专业基础", value: Math.round(dims.B * 5) },
        { name: "技术应用能力", value: Math.round(dims.C * 5) },
        { name: "学习能力", value: Math.round(dims.D * 5) },
        { name: "职业兴趣", value: Math.round(dims.E * 5) }
    ];
}

function calcCareers(dims) {
    var jobs = [
        { name: "无人机飞手", icon: "✈", req: {A:12, B:14, C:14, D:10, E:14}, desc: "负责无人机操控与飞行作业" },
        { name: "无人机系统工程师", icon: "🔧", req: {A:14, B:16, C:15, D:12, E:12}, desc: "负责无人机系统设计与维护" },
        { name: "低空数据分析师", icon: "📊", req: {A:12, B:14, C:15, D:12, E:12}, desc: "分析低空飞行数据与业务数据" },
        { name: "低空政策研究员", icon: "📋", req: {A:16, B:12, C:8, D:14, E:12}, desc: "研究低空经济政策与法规" },
        { name: "无人机物流运营", icon: "📦", req: {A:14, B:12, C:10, D:12, E:14}, desc: "负责无人机物流网络运营" },
        { name: "低空巡检专员", icon: "🚁", req: {A:12, B:14, C:13, D:10, E:12}, desc: "执行低空巡检任务" },
        { name: "无人机销售/解决方案", icon: "💼", req: {A:14, B:12, C:10, D:12, E:14}, desc: "提供无人机解决方案与销售" }
    ];
    jobs.forEach(function(j) {
        var matched = 0;
        if (dims.A >= j.req.A) matched++;
        if (dims.B >= j.req.B) matched++;
        if (dims.C >= j.req.C) matched++;
        if (dims.D >= j.req.D) matched++;
        if (dims.E >= j.req.E) matched++;
        j.match = matched >= 4 ? 85 : matched >= 2 ? 65 : 45;
    });
    jobs.sort(function (a, b) { return b.match - a.match; });
    return jobs;
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

function getSuggestions(dims) {
    var weak = [];
    if (dims.A < 12) weak.push({dim: "A", name: "行业认知"});
    if (dims.B < 12) weak.push({dim: "B", name: "专业基础"});
    if (dims.C < 12) weak.push({dim: "C", name: "技术应用能力"});
    if (dims.D < 12) weak.push({dim: "D", name: "学习能力"});
    if (dims.E < 12) weak.push({dim: "E", name: "职业兴趣"});

    weak.sort(function(a,b) { return dims[a.dim] - dims[b.dim]; });
    var result = [];

    for (var i = 0; i < Math.min(2, weak.length); i++) {
        var w = weak[i];
        if (w.dim === "A") {
            result.push({ icon: "📚", title: "加强行业认知", desc: "阅读低空经济行业报告，关注政策动态与应用场景" });
        } else if (w.dim === "B") {
            result.push({ icon: "🎓", title: "夯实专业基础", desc: "学习无人机基础课程，掌握核心技术原理" });
        } else if (w.dim === "C") {
            result.push({ icon: "🔧", title: "提升技术应用", desc: "参加实操培训，熟悉数据分析工具与软件平台" });
        } else if (w.dim === "D") {
            result.push({ icon: "💡", title: "强化学习能力", desc: "建立系统学习方法，培养自主学习习惯" });
        } else if (w.dim === "E") {
            result.push({ icon: "🌟", title: "探索职业兴趣", desc: "参与行业活动，深入了解不同岗位方向" });
        }
    }

    if (result.length === 0) {
        result.push({ icon: "🎯", title: "持续精进", desc: "保持学习状态，关注行业前沿技术" });
        result.push({ icon: "🤝", title: "拓展人脉", desc: "参与行业交流，构建专业网络" });
    }

    return result;
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

    for (var i = 0; i < n; i++) {
        var angle = i * 2 * Math.PI / n - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

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
