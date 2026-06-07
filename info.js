// info.js

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // 1. 在這裡設定你的 YouTube 影片 ID 
    //    (例如影片網址是 https://www.youtube.com/watch?v=dQw4w9WgXcQ ，ID 就是 dQw4w9WgXcQ)
    // ==========================================================================
    const youtubeVideoId = "dQw4w9WgXcQ"; // <-- 請把這串換成你真正的 KAGE 宣傳影片 ID！

    const openBtn = document.getElementById("open-video-btn");
    const lightbox = document.getElementById("video-lightbox");
    const iframeContainer = document.getElementById("video-iframe-container");

    if (!openBtn || !lightbox || !iframeContainer) return;

    // 2. 點擊預覽區：淡入燈箱、動態生成 iframe 達到「自動播放且有聲音」
    openBtn.addEventListener("click", () => {
        // 使用 YouTube 嵌入參數：
        // autoplay=1 (自動播放)
        // rel=0 (不顯示其他頻道推薦影片)
        // *注意：不要加 mute=1，這樣點開就會直接發出震撼的音樂聲！
        const iframeHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        
        // 把 iframe 塞進容器，並加上 active class 啟動 CSS 淡入效果
        iframeContainer.innerHTML = iframeHTML;
        lightbox.classList.add("active");
    });

    // 3. 點擊黑色背景任何地方：優雅淡出燈箱，並瞬間切斷影片聲音
    lightbox.addEventListener("click", (e) => {
        // 確保玩家是點到黑背景，而不是點到影片視窗本身
        if (e.target === lightbox) {
            lightbox.classList.remove("active");
            
            // 在淡出動態快結束時，把 iframe 清空，影片就會完全停止，絕不留餘音
            setTimeout(() => {
                iframeContainer.innerHTML = "";
            }, 400);
        }
    });
	
	// ==========================================================================
    // 【最佳化】監聽滾輪事件：只要有滑動就讓頁尾跑出來
    // ==========================================================================
    const footer = document.querySelector(".site-footer");
    
    if (footer) {
        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            // 門檻降低至 10px，只要玩家一滾動滑鼠就立刻 reveal！
            if (scrollTop > 10) {
                footer.classList.add("reveal");
            } else {
                footer.classList.remove("reveal");
            }
        });
    }
});