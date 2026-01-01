interface Bookmark {
  id: string;
  url: string;
  videoId?: string;
  title?: string;
  thumbnail?: string;
  time: number;
  note: string;
  addedAt: number;
}

const bookmarksDiv = document.getElementById("bookmarks")!;

function loadBookmarks() {
  chrome.storage.sync.get("bookmarks", (data) => {
    if (chrome.runtime.lastError) {
      console.error("Error loading bookmarks:", chrome.runtime.lastError);
      bookmarksDiv.innerHTML =
        "<p style='padding: 20px; text-align: center; color: #f00;'>Error loading bookmarks. Please check console.</p>";
      return;
    }
    const bookmarks: Bookmark[] = data.bookmarks || [];
    console.log("Loaded bookmarks:", bookmarks);
    renderBookmarks(bookmarks);
  });
}

// Load bookmarks on page load
loadBookmarks();

// Listen for storage changes to refresh when bookmarks are added/removed
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.bookmarks) {
    loadBookmarks();
  }
});

function renderBookmarks(bookmarks: Bookmark[]) {
  bookmarksDiv.innerHTML = "";

  if (bookmarks.length === 0) {
    bookmarksDiv.innerHTML =
      "<p style='padding: 20px; text-align: center; color: #888;'>No bookmarks yet. Go to YouTube and use the 🔖 Save button to bookmark a video!</p>";
    return;
  }

  bookmarks.sort((a, b) => b.addedAt - a.addedAt);

  bookmarks.forEach((b) => {
    const div = document.createElement("div");
    div.className = "bookmark";

    const hours = Math.floor(b.time / 3600);
    const minutes = Math.floor((b.time % 3600) / 60);
    const seconds = b.time % 60;
    const timeString =
      hours > 0
        ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        : `${minutes}:${seconds.toString().padStart(2, "0")}`;

    div.innerHTML = `
        <div class="bookmark-content">
          ${
            b.thumbnail
              ? `<img src="${b.thumbnail}" alt="${
                  b.title || "Video thumbnail"
                }" class="bookmark-thumbnail" onerror="this.src='https://img.youtube.com/vi/${
                  b.videoId || ""
                }/hqdefault.jpg'">`
              : ""
          }
          <div class="bookmark-info">
            <h3 class="bookmark-title">${b.title || "Untitled Video"}</h3>
            <div class="bookmark-time">⏱️ ${timeString}</div>
            <textarea class="bookmark-note" data-id="${
              b.id
            }" placeholder="Add a note...">${b.note || ""}</textarea>
          </div>
          <button data-id="${
            b.id
          }" class="delete" title="Delete bookmark">╳</button>
          <!-- To change the delete icon, edit the emoji above (currently 🗑️) 
               You can use: 🗑️ ❌ ✕ ╳ 🗙 or any Unicode/emoji character -->
        </div>
      `;

    bookmarksDiv.appendChild(div);
  });

  // Make bookmark clickable (opens video)
  document.querySelectorAll(".bookmark").forEach((bookmark) => {
    const bookmarkData = bookmarks.find(
      (b) => bookmark.querySelector(`[data-id="${b.id}"]`) !== null
    );
    if (bookmarkData) {
      bookmark.addEventListener("click", (e) => {
        // Don't open if clicking textarea or delete button
        const target = e.target as HTMLElement;
        if (
          target.classList.contains("bookmark-note") ||
          target.classList.contains("delete") ||
          target.closest(".delete") ||
          target.closest(".bookmark-note")
        ) {
          return;
        }
        window.open(`${bookmarkData.url}&t=${bookmarkData.time}s`, "_blank");
      });
      bookmark.classList.add("clickable");
    }
  });

  // Handle textarea editing - expand on double-click
  document.querySelectorAll(".bookmark-note").forEach((textarea) => {
    const textareaEl = textarea as HTMLTextAreaElement;
    let isExpanded = false;

    textareaEl.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (!isExpanded) {
        isExpanded = true;
        textareaEl.classList.add("expanded");
        textareaEl.style.height = "auto";
        textareaEl.style.height = `${textareaEl.scrollHeight}px`;
        textareaEl.focus();
      }
    });

    // Save note on blur
    textareaEl.addEventListener("blur", () => {
      isExpanded = false;
      textareaEl.classList.remove("expanded");
      // Scroll to top of textarea
      textareaEl.scrollTop = 0;
      const id = textareaEl.getAttribute("data-id")!;
      const newNote = textareaEl.value.trim();
      updateBookmarkNote(id, newNote);
    });

    // Auto-resize while typing
    textareaEl.addEventListener("input", () => {
      if (isExpanded) {
        textareaEl.style.height = "auto";
        textareaEl.style.height = `${textareaEl.scrollHeight}px`;
      }
    });

    // Stop click propagation
    textareaEl.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // Delete button handlers
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = (e.target as HTMLElement).getAttribute("data-id")!;
      deleteBookmark(id);
    });
  });
}

function updateBookmarkNote(id: string, note: string) {
  chrome.storage.sync.get("bookmarks", (data) => {
    const bookmarks: Bookmark[] = data.bookmarks || [];
    const updated = bookmarks.map((b) => (b.id === id ? { ...b, note } : b));
    chrome.storage.sync.set({ bookmarks: updated }, () => {
      // Don't re-render, just update the storage
      console.log("Note updated for bookmark:", id);
    });
  });
}

function deleteBookmark(id: string) {
  chrome.storage.sync.get("bookmarks", (data) => {
    const updated = (data.bookmarks || []).filter((b: Bookmark) => b.id !== id);
    chrome.storage.sync.set({ bookmarks: updated }, () =>
      renderBookmarks(updated)
    );
  });
}
