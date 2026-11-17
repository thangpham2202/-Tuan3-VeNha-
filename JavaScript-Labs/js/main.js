/* main.js – tương tác cho trang chủ JavaScript-Labs.
   Dùng các kỹ thuật đã học: DOM, sự kiện, biểu mẫu, hàm, mảng, đối tượng. */
(function () {
  "use strict";

  /* ---------- Giao diện sáng/tối ---------- */
  var root = document.documentElement;
  function applyTheme(t) { root.setAttribute("data-theme", t); }
  try {
    var saved = localStorage.getItem("jslabs-theme");
    if (saved) applyTheme(saved);
  } catch (err) { /* localStorage có thể bị chặn */ }
  document.getElementById("themeToggle").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("jslabs-theme", next); } catch (err) {}
  });

  /* ---------- Menu trên điện thoại ---------- */
  var nav = document.getElementById("mainNav");
  var toggle = document.getElementById("navToggle");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("open"); }
  });

  /* ---------- Đồng hồ ---------- */
  var clock = document.getElementById("clock");
  function tick() {
    var now = new Date();
    clock.textContent = "Bây giờ là " + now.toLocaleTimeString("vi-VN") + " – " + now.toLocaleDateString("vi-VN");
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Chuyển tab kiến thức ---------- */
  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".tab-panel");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function (e) {
      var id = e.currentTarget.getAttribute("data-tab");
      for (var j = 0; j < tabs.length; j++) {
        var on = tabs[j].getAttribute("data-tab") === id;
        tabs[j].classList.toggle("active", on);
        tabs[j].setAttribute("aria-selected", on ? "true" : "false");
        panels[j].classList.toggle("active", panels[j].id === id);
      }
    });
  }

  /* ---------- Đếm số và hiệu ứng khi cuộn ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10), n = 0;
    var step = Math.max(1, Math.round(target / 30));
    var timer = setInterval(function () {
      n = Math.min(target, n + step);
      el.textContent = n;
      if (n >= target) clearInterval(timer);
    }, 40);
  }
  var revealEls = document.querySelectorAll(".lab-card, .stats li, .panel-box, .reflection");
  for (var r = 0; r < revealEls.length; r++) { revealEls[r].classList.add("reveal"); }
  var counted = false;
  function onScroll() {
    var h = window.innerHeight;
    for (var k = 0; k < revealEls.length; k++) {
      if (revealEls[k].getBoundingClientRect().top < h - 40) revealEls[k].classList.add("shown");
    }
    var stats = document.getElementById("stats");
    if (!counted && stats.getBoundingClientRect().top < h) {
      counted = true;
      var nums = stats.querySelectorAll("b");
      for (var m = 0; m < nums.length; m++) countUp(nums[m]);
    }
  }
  window.addEventListener("scroll", onScroll);
  window.addEventListener("load", onScroll);

  /* ---------- Demo giỏ hàng ---------- */
  var products = [
    { name: "Áo thun cotton", price: 189000, qty: 1 },
    { name: "Tai nghe không dây", price: 650000, qty: 1 },
    { name: "Sổ tay A5", price: 45000, qty: 2 }
  ];
  function money(v) { return v.toLocaleString("vi-VN") + " ₫"; }
  var cartList = document.getElementById("cartList");
  var cartTotal = document.getElementById("cartTotal");
  function renderCart() {
    cartList.innerHTML = "";
    var total = 0;
    products.forEach(function (p, idx) {
      total += p.price * p.qty;
      var li = document.createElement("li");
      li.innerHTML = '<span class="name">' + p.name + '</span><span class="price">' + money(p.price) + '</span>' +
        '<button type="button" data-i="' + idx + '" data-d="-1" aria-label="Giảm">−</button>' +
        '<span class="qty">' + p.qty + '</span>' +
        '<button type="button" data-i="' + idx + '" data-d="1" aria-label="Tăng">+</button>';
      cartList.appendChild(li);
    });
    cartTotal.textContent = money(total);
  }
  cartList.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var p = products[parseInt(b.getAttribute("data-i"), 10)];
    p.qty = Math.max(0, p.qty + parseInt(b.getAttribute("data-d"), 10));
    renderCart();
  });
  renderCart();

  /* ---------- Demo biểu mẫu: focus/blur + kiểm tra dữ liệu ---------- */
  var form = document.getElementById("signupForm");
  var msg = document.getElementById("formMsg");
  var inputs = form.querySelectorAll("input");
  for (var q = 0; q < inputs.length; q++) {
    inputs[q].addEventListener("focus", function (e) { e.target.classList.add("focus-hl"); });
    inputs[q].addEventListener("blur", function (e) { e.target.classList.remove("focus-hl"); });
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var errors = [];
    var name = document.getElementById("demoName");
    var email = document.getElementById("demoEmail");
    name.classList.remove("invalid"); email.classList.remove("invalid");
    if (name.value.trim() === "") { errors.push("Họ tên không được để trống"); name.classList.add("invalid"); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { errors.push("Email chưa đúng định dạng"); email.classList.add("invalid"); }
    if (errors.length) {
      msg.className = "form-msg error";
      msg.innerHTML = errors.join("<br>");
    } else {
      msg.className = "form-msg ok";
      msg.textContent = "Cảm ơn " + name.value.trim() + "! Đăng ký thành công (chỉ là demo, dữ liệu không được gửi đi).";
      form.reset();
    }
  });
})();
