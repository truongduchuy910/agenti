# Agent AI Utilities

A lightweight utility package designed to simplify file watching and processing for AI-powered workflows. It provides a convenient `watch` method built on top of [`chokidar`](https://www.npmjs.com/package/chokidar), with added features for synchronous event handling and pattern-based file filtering.

---

## ✨ Features

- Built on top of `chokidar` for efficient file watching
- Synchronously handles file change events to prevent API rate limiting
- Supports flexible glob pattern matching for targeting specific files
- Minimal and easy-to-use API

---

## 📦 Installation

```bash
npm install agenti
# or
yarn add agenti
```

---

## 🛠 Usage

The `watch` method monitors your project directories for file changes and triggers a user-defined `processor` function for matched files. Unlike `chokidar`, it ensures the `change` events are handled synchronously, making it safer to work with APIs that have strict rate limits.

### Example

```ts
import { watch } from "agenti";

watch({
  projects: ["/path/to/your/project"], // Replace with the path to your project
  wildcards: [
    {
      name: "name-of-module", // Name of your AI module
      condition: "**/resource.md", // Glob pattern to match specific files
      processor: async (data) => {
        // Your custom logic to handle the matched file
        console.log("File changed:", data.path);
      },
    },
  ],
});
```

---

## 🧠 How It Works

- `projects`: An array of absolute paths to your project directories.
- `wildcards`: A list of file matchers with:

  - `name`: Identifier for the module or task.
  - `condition`: A glob pattern to match specific files.
  - `processor`: An async function that processes the file change event.

---

## 📁 Example Use Cases

- Trigger AI-generated documentation updates when a markdown file changes.
- Process training data files on modification.
- Run transformations or validations on content changes.

---

## 🔒 Rate Limit Friendly

Unlike standard `chokidar` usage, `agenti.watch` ensures change events are processed one at a time. This prevents spamming APIs or overlapping requests, especially useful when working with AI models or third-party services.

---

## 📃 License

MIT License

---

Let me know if you want sections like **Contributing**, **API Reference**, or **Changelog** added.
