// forums.js

// ==========================================================================
// 【關鍵設定】請在這裡填入你在 Google Apps Script 部署得到的 Web App URL
// ==========================================================================
const API_URL = "https://script.google.com/macros/s/AKfycbw8qRhHBUOdQs6-HMSVHOt6sf0ps_eYf87L4Ku_zo1uKVeY415boaVn_7llLNUYK5EB/exec"; 

document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
});

// 1. 從 Google 試算表 API 載入所有貼文
function loadPosts() {
    const container = document.getElementById("forum-list-container");
    if (!container) return;

    if (API_URL === "YOUR_GOOGLE_WEB_APP_URL") {
        container.innerHTML = `
            <div class="forum-empty">
                // API_URL NOT CONFIGURATION ACTIVE.<br>
                請在 forums.js 中填入正確的 Google Apps Script 部署網址。
            </div>
        `;
        return;
    }

    fetch(API_URL)
    .then(res => {
        if (!res.ok) throw new Error("Network status error");
        return res.json();
    })
    .then(data => {
        container.innerHTML = "";
        
        if (!data || data.length === 0) {
            container.innerHTML = `<div class="forum-empty">// NO DISCUSSIONS SUBMITTED YET_</div>`;
            return;
        }

        // 倒序排列（最新發布的文章排在最上面）
        data.reverse().forEach(post => {
            // 安全過濾防止 XSS 注入攻擊
            const safeAuthor = escapeHTML(post.author || "Anonymous");
            const safeContent = escapeHTML(post.content || "");
            const postDate = post.timestamp ? new Date(post.timestamp).toLocaleString() : "UNKNOWN_TIME";

            container.innerHTML += `
                <div class="forum-card">
                    <div class="forum-meta">
                        <span class="forum-author"># ${safeAuthor}</span>
                        <span class="forum-date">${postDate}</span>
                    </div>
                    <p class="forum-content">${safeContent}</p>
                </div>
            `;
        });
    })
    .catch(err => {
        console.error(err);
        container.innerHTML = `<div class="forum-empty">// SIGNAL INTERRUPTED / FAILED TO FETCH DATA_</div>`;
    });
}

// 2. 玩家送出發文
function submitPost() {
    const authorInput = document.getElementById("post-author");
    const contentInput = document.getElementById("post-content");
    const submitBtn = document.getElementById("post-submit-btn");

    if (!authorInput || !contentInput || !submitBtn) return;

    const author = authorInput.value.trim();
    const content = contentInput.value.trim();

    // 基礎驗證
    if (!author) {
        alert("請輸入玩家暱稱！");
        authorInput.focus();
        return;
    }
    if (!content) {
        alert("請輸入留言內容！");
        contentInput.focus();
        return;
    }

    // 禁用按鈕進入傳送狀態
    submitBtn.disabled = true;
    submitBtn.innerText = "TRANSMITTING..._";

    // === 將這段原本的 fetch 區塊替換掉 ===
    // 轉換成 Google 100% 絕對能接收的表單參數格式
    const formData = new URLSearchParams();
    formData.append("author", author);
    formData.append("content", content);

    // 發送 POST 請求到 Google Apps Script
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // 配合 Google 重新導向機制
        headers: {
            "Content-Type": "application/x-www-form-urlencoded" // 改用標準表單格式
        },
        body: formData.toString()
    })
    .then(() => {
        // 清空輸入框
        authorInput.value = "";
        contentInput.value = "";
        
        // 進入發文冷卻計時（10秒）
        startCooldown(10);
        
        // 延遲 2 秒後重新讀取最新文章（給 Google 試算表寫入的緩衝時間）
        setTimeout(loadPosts, 2000);
    })
    .catch(err => {
        console.error(err);
        alert("通訊失敗，請稍後再試。");
        submitBtn.disabled = false;
        submitBtn.innerText = "發布文章 / POST_";
    });
}

// 3. 發文防灌爆冷卻計時器
function startCooldown(seconds) {
    const submitBtn = document.getElementById("post-submit-btn");
    let timeLeft = seconds;

    submitBtn.disabled = true;

    const interval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(interval);
            submitBtn.disabled = false;
            submitBtn.innerText = "發布文章 / POST_";
        } else {
            submitBtn.innerText = `COOLDOWN (${timeLeft}s)_`;
        }
    }, 1000);
}

// 4. 防止玩家輸入 HTML 語法導致網頁壞掉的防禦函式 (XSS防護)
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}