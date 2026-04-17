async function register() {
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;
    var password2 = document.getElementById("password2").value;
    var tip = document.getElementById("regTip");

    if (!username || !password) {
        tip.textContent = "请填写用户名和密码";
        tip.className = "form-tip";
        return;
    }
    if (password !== password2) {
        tip.textContent = "两次密码输入不一致";
        tip.className = "form-tip";
        return;
    }

    try {
        var res = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });

        var data = await res.json();
        console.log("注册返回:", data);

        if (data.success === true) {
            tip.textContent = "注册成功！即将跳转登录...";
            tip.className = "form-tip ok";
            setTimeout(function () {
                window.location.href = "login.html";
            }, 800);
        } else {
            tip.textContent = data.message || "注册失败，请重试";
            tip.className = "form-tip";
        }

    } catch (e) {
        console.error(e);
        tip.textContent = "网络错误，请稍后再试";
        tip.className = "form-tip";
    }
}

async function login() {
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;
    var tip = document.getElementById("loginTip");

    if (!username || !password) {
        tip.textContent = "请填写用户名和密码";
        tip.className = "form-tip";
        return;
    }

    try {
        var res = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });

        var data = await res.json();
        console.log("状态码:", res.status, "返回数据:", data);

        if (data.success === true) {
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('userId', data.userId || "");
            localStorage.setItem('username', data.username || username);

            tip.textContent = "登录成功！即将跳转...";
            tip.className = "form-tip ok";

            setTimeout(function () {
                window.location.href = "index.html";
            }, 600);
        } else {
            tip.textContent = data.message || '账号或密码错误，请重试';
            tip.className = "form-tip";
        }

    } catch (e) {
        console.error(e);
        tip.textContent = "网络错误，请稍后再试";
        tip.className = "form-tip";
    }
}