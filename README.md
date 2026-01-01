# YouTube Bookmarker

A Chrome browser extension that allows you to bookmark YouTube videos with timestamps and notes. Never lose track of important moments in your favorite videos!

## ✨ Features

- **🔖 Timestamp Bookmarks**: Save bookmarks at specific moments in YouTube videos
- **📝 Notes**: Add custom notes to each bookmark for context
- **🖼️ Thumbnail Previews**: Visual previews of bookmarked videos
- **⚡ Quick Access**: Click any bookmark to jump directly to the saved timestamp
- **✏️ Editable Notes**: Double-click notes to expand and edit them
- **🗑️ Easy Deletion**: Remove bookmarks with a single click
- **☁️ Cloud Sync**: Bookmarks sync across all your Chrome browsers using Chrome Sync
- **🔄 Auto-Refresh**: Popup automatically updates when new bookmarks are added

## 📦 Installation

### Step 1: Download or Clone the Repository

If you have the project files, make sure they're in a folder on your computer. If you're cloning from a repository:

```bash
git clone <repository-url>
cd bookmark
```

### Step 2: Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

### Step 3: Build the Extension

Compile the TypeScript files to JavaScript:

```bash
npm run build
```

This will:
- Compile all TypeScript files from `src/` to `dist/`
- Copy the CSS file to the `dist/` folder

### Step 4: Load the Extension in Chrome

1. **Open Chrome Extensions Page**:
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to: **Menu (⋮) → Extensions → Manage Extensions**

2. **Enable Developer Mode**:
   - Toggle the **"Developer mode"** switch in the top-right corner

3. **Load the Extension**:
   - Click **"Load unpacked"** button
   - Select the `bookmark` folder (the root folder containing `manifest.json`)
   - Click **"Select Folder"**

4. **Verify Installation**:
   - You should see "YouTube Bookmarker" in your extensions list
   - The extension icon should appear in your Chrome toolbar

### Step 5: Pin the Extension (Optional)

- Click the **Extensions icon (puzzle piece)** in the Chrome toolbar
- Find "YouTube Bookmarker"
- Click the **pin icon** to keep it visible in your toolbar

## 🚀 Usage

### Creating a Bookmark

1. **Navigate to YouTube**: Go to any YouTube video page
2. **Play the Video**: Start playing the video and navigate to the moment you want to bookmark
3. **Click the Save Button**: Look for the **"🔖 Save"** button in the YouTube player controls (top-right area of the video player)
4. **Add a Note** (Optional): A prompt will appear asking for a note. Enter your note or leave it blank
5. **Confirm**: Click OK. You'll see a confirmation message: "✅ Bookmark saved!"

### Viewing Your Bookmarks

1. **Open the Extension**: Click the YouTube Bookmarker icon in your Chrome toolbar
2. **Browse Bookmarks**: All your saved bookmarks will be displayed with:
   - Video thumbnail
   - Video title
   - Timestamp (formatted as MM:SS or HH:MM:SS)
   - Your note
3. **Open a Bookmark**: Click anywhere on a bookmark card to open the video at the saved timestamp in a new tab

### Editing Notes

1. **Double-click** on any note textarea in the popup
2. The note will expand, allowing you to edit it
3. Click outside or press Tab to save your changes

### Deleting Bookmarks

1. Click the **"╳"** button in the top-right corner of any bookmark card
2. The bookmark will be immediately removed

## 🛠️ Development

### Project Structure

```
bookmark/
├── src/                    # TypeScript source files
│   ├── background.ts      # Service worker (initializes storage)
│   ├── content.ts         # Content script (injects button into YouTube)
│   ├── popup.ts           # Popup UI logic and bookmark management
│   └── styles.css         # Styling for the popup interface
├── dist/                  # Compiled output (generated after build)
│   ├── background.js      # Compiled background script
│   ├── content.js         # Compiled content script
│   ├── popup.js           # Compiled popup script
│   ├── popup.html         # Popup HTML interface
│   └── styles.css         # Copied CSS file
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── manifest.json          # Extension configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

### Available Scripts

- **`npm run build`**: Compile TypeScript and copy CSS to `dist/` folder
- **`npm run watch`**: Watch for file changes and automatically rebuild
- **`npm test`**: Run tests (currently not configured)

### Development Workflow

1. **Make Changes**: Edit files in the `src/` directory
2. **Rebuild**: Run `npm run build` (or use `npm run watch` for auto-rebuild)
3. **Reload Extension**: 
   - Go to `chrome://extensions/`
   - Click the **refresh icon** on the YouTube Bookmarker extension card
4. **Test**: Navigate to YouTube and test your changes

### Key Files Explained

- **`manifest.json`**: Defines extension permissions, scripts, and metadata
- **`background.ts`**: Service worker that initializes storage on installation
- **`content.ts`**: Injected into YouTube pages to add the bookmark button
- **`popup.ts`**: Handles the popup UI, displays bookmarks, and manages CRUD operations
- **`styles.css`**: Dark-themed styling for the popup interface

## 🔧 Technical Details

### Technologies Used

- **TypeScript**: Type-safe JavaScript development
- **Chrome Extension APIs**: 
  - `chrome.storage.sync` for cloud-synced storage
  - `chrome.runtime` for extension communication
  - `chrome.scripting` for content script injection
- **DOM Manipulation**: For YouTube player integration
- **CSS3**: Modern styling with flexbox and transitions

### Browser Compatibility

- **Chrome**: ✅ Fully supported
- **Edge (Chromium)**: ✅ Should work (uses same extension system)
- **Other Chromium browsers**: ✅ Should work
- **Firefox**: ❌ Not supported (requires different manifest format)

### Storage

Bookmarks are stored using Chrome's `storage.sync` API, which:
- Syncs across all devices where you're signed into Chrome
- Has a limit of 100KB per extension
- Automatically handles conflicts and updates

### Permissions

The extension requires:
- **`storage`**: To save and retrieve bookmarks
- **`activeTab`**: To access the current YouTube tab
- **`scripting`**: To inject the content script into YouTube pages

## 🐛 Troubleshooting

### Bookmark Button Not Appearing

1. **Refresh the YouTube page**: Sometimes the button needs a moment to load
2. **Check Console**: Open Chrome DevTools (F12) and check for errors
3. **Reload Extension**: Go to `chrome://extensions/` and click the refresh icon
4. **Verify URL**: Make sure you're on `youtube.com/watch?v=...` (not just `youtube.com`)

### Bookmarks Not Saving

1. **Check Storage**: Open Chrome DevTools → Application → Storage → Chrome Sync
2. **Check Permissions**: Ensure the extension has storage permissions
3. **Check Console**: Look for error messages in the console

### Popup Not Showing Bookmarks

1. **Reload Extension**: Refresh the extension in `chrome://extensions/`
2. **Check Storage**: Verify bookmarks exist in Chrome storage
3. **Open Console**: Check the popup's console for errors (right-click popup → Inspect)

### Extension Not Loading

1. **Check manifest.json**: Ensure it's valid JSON
2. **Check Build**: Make sure you've run `npm run build`
3. **Check File Paths**: Verify all files referenced in manifest.json exist in `dist/`
4. **Check Console**: Look for errors in the extensions page

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Made with ❤️ for YouTube enthusiasts**

