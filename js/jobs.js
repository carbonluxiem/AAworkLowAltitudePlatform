let jobs=[

    {
    name:"无人机巡检工程师",
    desc:"负责电力线路巡检无人机操作",
    require:8
    },
    
    {
    name:"低空物流运营",
    desc:"负责无人机物流调度",
    require:6
    },
    
    {
    name:"应急救援无人机操作员",
    desc:"参与灾害监测飞行任务",
    require:5
    }
    
    ]
    
    function loadJobs(){
    
    let container=document.getElementById("jobList")
    
    jobs.forEach(function(job){
    
    container.innerHTML+=`
    
    <div class="card">
    
    <h3>${job.name}</h3>
    
    <p>${job.desc}</p>
    
    <button class="btn" onclick="match(${job.require})">
    
    查看匹配
    
    </button>
    
    </div>
    
    `
    
    })
    
    }
    
    function match(require){
    
    let score=localStorage.getItem("score")
    
    if(score>=require){
    
    alert("岗位匹配度：高")
    
    }else{
    
    alert("岗位匹配度：中")
    
    }
    
    }