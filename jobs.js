// 如果后端可以访问，优先通过后端获取岗位匹配结果

function loadJobs() {
    var container = document.getElementById("jobList");
    container.innerHTML = "";

    var userId = localStorage.getItem('userId');
    if (!userId) {
        // 未登录时使用本地默认岗位
        renderJobs(getLocalJobs());
        return;
    }

    fetch('http://localhost:8080/api/jobs?userId=' + encodeURIComponent(userId))
        .then(function (res) {
            if (!res.ok) throw new Error('网络错误');
            return res.json();
        })
        .then(function (jobs) {
            renderJobs(jobs);
        })
        .catch(function () {
            renderJobs(getLocalJobs());
        });
}

function renderJobs(jobs) {
    var container = document.getElementById("jobList");
    container.innerHTML = "";
    jobs.forEach(function (job) {
        var matchText = job.match != null ? (job.match >= 75 ? '高度匹配' : job.match >= 50 ? '较为匹配' : '基础匹配') : '';
        var matchLabel = matchText ? ('<div class="job-match">' + matchText + ' ' + (job.match || '') + '%</div>') : '';
        container.innerHTML += `
            <div class="card">
                <h3>${job.name}</h3>
                <p>${job.desc}</p>
                ${matchLabel}
                <div class="job-actions">
                    <button class="btn" onclick="viewJobDetail('${job.id}')">查看详情</button>
                    <button class="btn btn-outline" onclick="alert('岗位匹配度：${matchText || '未知'}')">
                        查看匹配
                    </button>
                </div>
            </div>
        `;
    });
}

function viewJobDetail(jobId) {
    window.location.href = 'job-detail.html?jobId=' + encodeURIComponent(jobId);
}

function getLocalJobs() {
    return [
        { name: "无人机飞手", desc: "负责无人机操控与飞行作业", match: 75 },
        { name: "无人机系统工程师", desc: "负责无人机系统设计与维护", match: 70 },
        { name: "低空数据分析师", desc: "分析低空飞行数据与业务数据", match: 65 },
        { name: "低空政策研究员", desc: "研究低空经济政策与法规", match: 60 },
        { name: "无人机物流运营", desc: "负责无人机物流网络运营", match: 55 },
        { name: "低空巡检专员", desc: "执行低空巡检任务", match: 50 },
        { name: "无人机销售/解决方案", desc: "提供无人机解决方案与销售", match: 45 }
    ];
}
