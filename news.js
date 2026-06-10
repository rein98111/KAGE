// news.js

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // 1. 新聞公告資料數據庫 (增加 content 欄位放置展開後的詳細內容)
    // ==========================================================================
    
    // 【公告】分頁的資料
    const announcementData = [
	    {
            date: "2026.06.10",
            tag: "公告",
            class: "tag-ann",
            title: "KAGE官網 玩家討論區 上線",
            content: "玩家現已可到玩家討論區留言。"
        },
	    {
            date: "2026.06.07",
            tag: "更新",
            class: "tag-upd",
            title: "【v0.1.4】新版本已上線",
            content: "版本 0.1.4 安裝檔已放置在下載區。"
        },
	    {
            date: "2026.06.07",
            tag: "活動",
            class: "tag-eve",
            title: "六月七日６７",
            content: "6月7日<br>67日<br>版本0.1.4預計今日將安裝檔放到下載區"
        },
        {
            date: "2026.06.07",
            tag: "公告",
            class: "tag-ann",
            title: "KAGE官方網站上線",
            content: "《KAGE》官方網站已於今日上線！<br>玩家可以透過首頁下方的「前往安裝遊戲檔案」按鈕前往下載區下載最新版本檔案。"
        }
    ];

    // 【譜面】分頁的資料
    const chartData = [
		{
            date: "2026.06.07",
            tag: "圖譜",
            class: "tag-map",
            title: "譜面追加",
            content: "曲名: Aegleseeker [mtk's Inner Oni]"
        },
		{
            date: "2026.06.07",
            tag: "圖譜",
            class: "tag-map",
            title: "譜面追加",
            content: "曲名: 未来のヒーローたちへ (TV Size) [Oni]"
        },
		{
            date: "2026.06.07",
            tag: "圖譜",
            class: "tag-map",
            title: "譜面追加",
            content: "曲名: A Bella! (feat. Lucy) [Chromoxx' Inner Oni]"
        },
        {
            date: "2026.06.07",
            tag: "圖譜",
            class: "tag-map",
            title: "譜面追加",
            content: "曲名: ...and Rescue Me (TV Size)"
        }
    ];

    // ==========================================================================
    // 2. 自動渲染生成 HTML 結構的函式 (升級為可折疊結構)
    // ==========================================================================
    function renderNewsList(dataArray, targetContainerId) {
        const container = document.getElementById(targetContainerId);
        if (!container) return;

        container.innerHTML = "";

        dataArray.forEach(item => {
            // 注意：這裡改為 div 包裹，並加上 news-content-box 作為隱藏內容欄
            const rowHTML = `
                <div class="news-item-wrapper-box">
                    <div class="news-item-row">
                        <div class="news-meta">
                            <span class="news-date">${item.date}</span>
                            <span class="news-tag ${item.class}">${item.tag}</span>
                        </div>
                        <div class="news-title">${item.title}</div>
                        <span class="news-arrow">▶</span>
                    </div>
                    <div class="news-content-box">
                        <div class="news-content-inner">
                            ${item.content}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += rowHTML;
        });

        // 為這一組剛剛生成的公告綁定點擊事件
        initAccordion(container);
    }

    // ==========================================================================
    // 3. 點擊展開/攤開的邏輯
    // ==========================================================================
    function initAccordion(container) {
        const items = container.querySelectorAll('.news-item-wrapper-box');
        
        items.forEach(item => {
            const header = item.querySelector('.news-item-row');
            
            header.addEventListener('click', () => {
                // 如果目前這一條已經是打開的，就關掉它
                const isOpen = item.classList.contains('open');
                
                // 先把同一個分頁內的所有其他公告都關掉（一次只攤開一條，畫面比較乾淨）
                items.forEach(i => i.classList.remove('open'));
                
                // 如果原本是關的，現在就打開它
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        });
    }

    // 網頁載入時渲染
    renderNewsList(announcementData, "tab-announcement");
    renderNewsList(chartData, "tab-chart");

    // ==========================================================================
    // 4. 「公告/譜面」分頁按鈕切換邏輯
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.panel-tab-btn');
    const contentGroups = document.querySelectorAll('.news-list-group');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const targetTab = this.getAttribute('data-tab');
            contentGroups.forEach(group => group.classList.remove('active'));
            
            const targetGroup = document.getElementById(`tab-${targetTab}`);
            if (targetGroup) {
                targetGroup.classList.add('active');
            }
        });
    });
});
