function register() {
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;
    var password2 = document.getElementById("password2").value;
    var tip = document.getElementById("regTip");

    if (!username) { tip.textContent = "用户名不能为空"; tip.className = "form-tip"; return; }
    if (username.length < 2) { tip.textContent = "用户名至少 2 个字符"; tip.className = "form-tip"; return; }
    if (!password) { tip.textContent = "密码不能为空"; tip.className = "form-tip"; return; }
    if (password.length < 4) { tip.textContent = "密码至少 4 位"; tip.className = "form-tip"; return; }
    if (password !== password2) { tip.textContent = "两次密码输入不一致，检查一下～"; tip.className = "form-tip"; return; }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    tip.textContent = "注册成功！即将跳转登录...";
    tip.className = "form-tip ok";
    setTimeout(function () { window.location.href = "login.html"; }, 800);
}

function login() {
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;
    var tip = document.getElementById("loginTip");

    if (!username || !password) {
        tip.textContent = "请填写用户名和密码";
        tip.className = "form-tip";
        return;
    }

    var savedUser = localStorage.getItem("username");
    var savedPass = localStorage.getItem("password");

    if (username === savedUser && password === savedPass) {
        tip.textContent = "登录成功！即将跳转...";
        tip.className = "form-tip ok";
        setTimeout(function () { window.location.href = "index.html"; }, 600);
    } else {
        tip.textContent = "账号或密码错误，请重试";
        tip.className = "form-tip";
    }
}
