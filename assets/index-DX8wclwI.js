(function(){
    // Logic kiểm tra và tải module preload (tối ưu hóa tải trang)
    const n = document.createElement("link").relList;
    if(n && n.supports && n.supports("modulepreload")) return;

    for(const e of document.querySelectorAll('link[rel="modulepreload"]')) s(e);

    new MutationObserver(e=>{
        for(const o of e)
            if(o.type === "childList")
                for(const u of o.addedNodes)
                    u.tagName === "LINK" && u.rel === "modulepreload" && s(u)
    }).observe(document,{childList:!0,subtree:!0});

    function c(e){
        const o = {};
        return e.integrity && (o.integrity = e.integrity),
               e.referrerPolicy && (o.referrerPolicy = e.referrerPolicy),
               e.crossOrigin === "use-credentials" ? o.credentials = "include" :
               e.crossOrigin === "anonymous" ? o.credentials = "omit" :
               o.credentials = "same-origin",
               o
    }

    function s(e){
        if(e.ep) return;
        e.ep = !0;
        const o = c(e);
        fetch(e.href,o)
    }
})();

// === CẤU HÌNH VÀ BIẾN TRẠNG THÁI ===

// Các trạng thái của Terminal
const r = {
    INITIAL: "initial",
    DISAPPEARING: "disappearing",
    WAITING: "waiting",
    TYPING: "typing",
    COMPLETE: "complete"
};
let a = r.INITIAL; // Trạng thái hiện tại

// Cấu hình tin nhắn và tốc độ
const i = {
    message: "Nhạc Mi chó hay vcl, mấy con gà biết gì.",
    promptText: "Press any key to continue",
    typingSpeed: 100, // Tốc độ gõ chữ (ms)
    disappearSpeed: 80, // Tốc độ xóa chữ (ms)
    waitTime: 1300, // Thời gian chờ giữa các trạng thái (ms)
    cursorChar: "_"
};

// Lấy các phần tử DOM
const d = document.getElementById("prompt");
const p = document.getElementById("message");
const l = document.getElementById("morse-audio");
const m = document.getElementById("copyright");

// === KHỞI TẠO ===
function I(){
    document.addEventListener("keydown", T);
    document.addEventListener("click", L);
    l && l.load();
    console.log("Retro CLI initialized. Press any key to continue...")
}

// === XỬ LÝ SỰ KIỆN KHỞI ĐẦU ===
function T(t){
    a === r.INITIAL && f() // Bắt đầu khi nhấn phím
}

function L(t){
    a === r.INITIAL && f() // Bắt đầu khi click chuột
}

// === HÀM BẮT ĐẦU CHUỖI HIỆU ỨNG ===
function f(){
    a = r.DISAPPEARING;
    y(i.promptText, i.promptText.length)
}

// === HIỆU ỨNG XÓA CHỮ (DISAPPEARING) ===
function y(t, n){
    if(n > 0){
        const c = t.substring(0, n);
        const s = document.createElement("span");
        s.className = "cursor";
        s.textContent = i.cursorChar;
        d.innerHTML = c;
        d.appendChild(s);
        
        setTimeout(()=>{
            y(t, n - 1)
        }, i.disappearSpeed)
    } else {
        d.innerHTML = "";
        h()
    }
}

// === CHỜ (WAITING) ===
function h(){
    a = r.WAITING;
    setTimeout(()=>{
        E()
    }, i.waitTime)
}

// === BẮT ĐẦU GÕ (START TYPING) ===
function E(){
    a = r.TYPING;
    d.classList.add("hidden");
    p.classList.remove("hidden");
    m && m.classList.add("show"); // Hiện copyright
    C(); // Bật audio
    g(i.message, 0)
}

// === HIỆU ỨNG GÕ CHỮ (TYPING) ===
function g(t, n){
    if(n < t.length){
        const c = document.createElement("span");
        c.textContent = t.substring(0, n + 1);
        
        const s = document.createElement("span");
        s.className = "cursor";
        s.textContent = i.cursorChar;
        
        p.innerHTML = "";
        p.appendChild(c);
        p.appendChild(s);
        
        setTimeout(()=>{
            g(t, n + 1)
        }, i.typingSpeed)
    } else {
        N()
    }
}

// === HOÀN THÀNH (COMPLETE) ===
function N(){
    a = r.COMPLETE;
    console.log("Typing complete. Message displayed.")
}

// === PHÁT AUDIO ===
function C(){
    l && l.play().catch(t=>{
        console.warn("Audio playback failed:", t);
        console.log("Note: Audio file may not be present yet. Please add NewPage.mp3 to src/assets/")
    })
}

// === GỌI HÀM KHỞI TẠO KHI DOM LOAD XONG ===
document.addEventListener("DOMContentLoaded", I);