function addBookmarkButton() {
  const controls = document.querySelector(".ytp-right-controls");
  if (!controls || document.getElementById("yt-bookmark-btn")) return;

  const btn = document.createElement("button");
  btn.id = "yt-bookmark-btn";
  btn.innerText = "🔖 Save";
  btn.style.cssText =
    "background:none; color:white; border:none; cursor:pointer; margin-left:8px; padding: 5px 10px; font-size: 14px;";

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Bookmark button clicked!");

    const video = document.querySelector("video");
    if (!video) {
      alert("❌ No video found!");
      return;
    }

    const time = Math.floor(video.currentTime || 0);
    let url = window.location.href.split("&t=")[0];
    url = url.split("?t=")[0]; // Also handle ?t= format

    // Extract video ID from URL
    const videoIdMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : "";

    // Get video title
    const titleElement = document.querySelector(
      "h1.ytd-watch-metadata yt-formatted-string, h1.title yt-formatted-string, h1.ytd-video-primary-info-renderer"
    );
    const title = titleElement?.textContent?.trim() || "Untitled Video";

    // Get thumbnail URL (using YouTube's thumbnail API)
    const thumbnail = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "";

    const note = prompt("Add a note for this timestamp:") || "";

    const bookmark = {
      id: crypto.randomUUID(),
      url,
      videoId,
      title,
      thumbnail,
      time,
      note,
      addedAt: Date.now(),
    };

    console.log("Saving bookmark:", bookmark);

    // Check if chrome API is available
    if (typeof chrome === "undefined" || !chrome.storage) {
      console.error("Chrome storage API not available!");
      alert(
        "❌ Chrome storage API not available. Please reload the extension."
      );
      return;
    }

    chrome.storage.sync.get("bookmarks", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting bookmarks:", chrome.runtime.lastError);
        alert("❌ Error: " + chrome.runtime.lastError.message);
        return;
      }

      const bookmarks = data.bookmarks || [];
      bookmarks.push(bookmark);

      chrome.storage.sync.set({ bookmarks }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving bookmark:", chrome.runtime.lastError);
          alert(
            "❌ Error saving bookmark: " + chrome.runtime.lastError.message
          );
        } else {
          console.log("Bookmark saved successfully:", bookmark);
          console.log("Total bookmarks now:", bookmarks.length);
          alert("✅ Bookmark saved!");
        }
      });
    });
  });

  controls.prepend(btn);
  console.log("Bookmark button added to YouTube player");
}

// Function to initialize the bookmark button
function initializeBookmarkButton() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    console.log("Chrome extension API is available");
    // Try to add button immediately and then periodically
    addBookmarkButton();
    setInterval(addBookmarkButton, 3000);
  } else {
    console.error("Chrome extension API not available in content script!");
    // Fallback: try again after a short delay
    setTimeout(() => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        addBookmarkButton();
        setInterval(addBookmarkButton, 3000);
      } else {
        console.error("Chrome API still not available after delay");
      }
    }, 1000);
  }
}

// Initialize when page loads
initializeBookmarkButton();

// Listen for YouTube navigation (SPA routing)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Wait a bit for YouTube to finish loading the new page
    setTimeout(() => {
      console.log("YouTube page changed, re-adding bookmark button");
      // Remove existing button if it exists
      const existingBtn = document.getElementById("yt-bookmark-btn");
      if (existingBtn) {
        existingBtn.remove();
      }
      // Re-initialize button
      initializeBookmarkButton();
    }, 1000);
  }
}).observe(document, { subtree: true, childList: true });

// Also listen for popstate events (back/forward navigation)
window.addEventListener("popstate", () => {
  setTimeout(() => {
    const existingBtn = document.getElementById("yt-bookmark-btn");
    if (existingBtn) {
      existingBtn.remove();
    }
    initializeBookmarkButton();
  }, 500);
});

// Listen for YouTube's custom navigation event
window.addEventListener("yt-navigate-finish", () => {
  setTimeout(() => {
    const existingBtn = document.getElementById("yt-bookmark-btn");
    if (existingBtn) {
      existingBtn.remove();
    }
    initializeBookmarkButton();
  }, 500);
});

//uses a set interval instead of obserbing changes in the DOM
//notes collected via prompt
// uses chrome.storage.sync to store bookmarks
