// maps.js

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // 1. 歌曲譜面資料庫 (以後增加新歌，直接複製一整組 {} 往下貼即可)
    // ==========================================================================
    const songData = [
	    {
            title: "10 Things About Sidetracked Day [LUX]",
            artist: "VINXIS vs. Leah Kate",
            creator: "susFries",
            LV: "09",
            bpm: "188",
            time: "01:11",
            AR: "12"
        },
        {
            title: "歌いましょう鳴らしましょう [Oni]",
            artist: "MyGO!!!!!",
            creator: "My Angel Shinku (From osu!)",
            LV: "12",
            bpm: "222",
            time: "02:53",
            AR: "10"
        },
		{
            title: "VOICE (TV Size) [Oni]",
            artist: "ZAQ",
            creator: "Amasugi (From osu!)",
            LV: "08",
            bpm: "184",
            time: "01:28",
            AR: "10"
        },
		{
            title: "Die Young (ང།སཇ ཎ༳ ཎལཇ ལཇཅཁ༒ remix) [Heartbeat]",
            artist: "Ke$ha",
            creator: "Heartbeat (From osu!)",
            LV: "10+",
            bpm: "170",
            time: "01:40",
            AR: "11"
        },
		{
            title: "...and Rescue Me (TV Size) [Oni]",
            artist: "Rainy.",
            creator: "Charlotte (From osu!)",
            LV: "07",
            bpm: "129",
            time: "01:17",
            AR: "09"
        },
		{
            title: "A Bella! (feat. Lucy) [Chromoxx' Inner Oni]",
            artist: "M2U",
            creator: "ZiRoX (From osu!)",
            LV: "09",
            bpm: "160",
            time: "01:59",
            AR: "10"
        },
		{
            title: "未来のヒーローたちへ (TV Size) [Oni]",
            artist: "タケヤキ翔",
            creator: "[-E S I A-] (From osu!)",
            LV: "08",
            bpm: "185",
            time: "01:28",
            AR: "10"
        },
		{
            title: "Aegleseeker [mtk's Inner Oni]",
            artist: "Silentroom vs. Frums",
            creator: "Faputa (From osu!)",
            LV: "14+",
            bpm: "234",
            time: "02:25",
            AR: "13"
        },
		
    ];

// ==========================================================================
    // 2. 核心控制邏輯：即時搜尋與難度篩選
    // ==========================================================================
    const container = document.getElementById("maps-list-container");
    const searchInput = document.getElementById("map-search-input");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let currentFilter = "all";  // 預設篩選：全部
    let searchQuery = "";       // 預設搜尋：無

    // 渲染歌曲列表的專用函式
    function renderMaps() {
        if (!container) return;
        container.innerHTML = "";

        // 進行雙重條件過濾（難度 + 關鍵字）
        const filteredSongs = songData.filter(song => {
            // A. 難度篩選邏輯
            let matchesFilter = false;
            // 由於有些難度帶有 "+" (例如 14+)，我們轉成浮點數來安全判定
            const lvNum = parseFloat(song.LV); 

            if (currentFilter === "all") {
                matchesFilter = true;
            } else if (currentFilter === "basic") {
                matchesFilter = (lvNum >= 1 && lvNum <= 9);
            } else if (currentFilter === "advanced") {
                matchesFilter = (lvNum >= 10 || song.LV.includes('+'));
            }

            // B. 搜尋關鍵字邏輯 (支援歌名、歌手，且不分大小寫)
            const matchesSearch = 
                song.title.toLowerCase().includes(searchQuery) || 
                song.artist.toLowerCase().includes(searchQuery);

            return matchesFilter && matchesSearch;
        });

        // 萬一搜不到任何歌，跳出科幻風無訊號提示
        if (filteredSongs.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 0; color: #555555; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                    // NO COMPATIBLE BEATMAPS FOUND_
                </div>
            `;
            return;
        }

        // 開始將過濾後的歌曲渲染成卡片
        filteredSongs.forEach(song => {
            // ==========================================================================
            // 【全新新增】動態判斷難度顏色 class
            // ==========================================================================
            const lvNum = parseFloat(song.LV);
            let lvColorClass = "lv-green"; // 預設綠色

            if (lvNum >= 1 && lvNum <= 3) {
                lvColorClass = "lv-green";
            } else if (lvNum >= 4 && lvNum <= 6) {
                lvColorClass = "lv-yellow";
            } else if (lvNum >= 7 && lvNum <= 9) {
                lvColorClass = "lv-orange";
            } else if (lvNum >= 10 && lvNum <= 13) {
                lvColorClass = "lv-red";
            } else if (lvNum >= 14) {
                lvColorClass = "lv-purple";
            }

            // 將 lvColorClass 動態塞進下面的 <div class="song-lv-badge ${lvColorClass}">
            const cardHTML = `
                <div class="map-card">
                    <div class="card-header">
                        <div class="song-lv-badge ${lvColorClass}">LV.${song.LV}</div>
                        <h3 class="song-title" title="${song.title}">${song.title}</h3>
                    </div>
                    <div class="song-artist">Artist: ${song.artist}</div>
                    <div class="song-creator">Creator: ${song.creator}</div>
                    <div class="card-divider"></div>
                    <div class="card-params">
                        <div class="param-box">
                            <span class="param-label">BPM</span>
                            <span class="param-value">${song.bpm}</span>
                        </div>
                        <div class="param-box">
                            <span class="param-label">TIME</span>
                            <span class="param-value">${song.time}</span>
                        </div>
                        <div class="param-box" title="Scroll Speed (捲動速度)">
                            <span class="param-label">sS</span>
                            <span class="param-value">${song.AR}</span>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    }

    // 監聽：搜尋欄輸入事件
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderMaps(); // 每次打字就即時重新渲染
        });
    }

    // 監聽：難度篩選按鈕點擊事件
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // 1. 切換按鈕的 active 視覺高亮
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // 2. 更新篩選狀態並重新選染
            currentFilter = btn.getAttribute("data-filter");
            renderMaps();
        });
    });

    // 初始化：網頁載入完成後先渲染一次完整列表
    renderMaps();
});