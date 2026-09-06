(function () {
  const starterTasks = {
    pending: [
      { description: "Submit assignment", priority: "High", due_date: "2026-09-10" },
      { description: "Prepare for interview", priority: "High", due_date: "2026-09-15" },
      { description: "Update resume", priority: "Medium", due_date: "2026-09-12" },
      { description: "Read argparse docs", priority: "Low", due_date: "No Due Date" },
    ],
    completed: [
      { description: "Setup Python environment", priority: "Medium", due_date: "2026-09-01" },
    ],
  };

  const output = document.getElementById("term-output");
  const form = document.getElementById("term-form");
  const input = document.getElementById("term-input");
  const terminal = document.getElementById("demo");
  if (!output || !form || !input) return;

  const history = [];
  let historyIndex = 0;
  let state = clone(starterTasks);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function colorClass(priority) {
    return { High: "high", Medium: "medium", Low: "low" }[priority] || "";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function print(html) {
    const line = document.createElement("div");
    line.className = "term-line";
    line.innerHTML = html;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function printPrompt(command) {
    print(
      `<span class="prompt">kajal@cli</span> <span class="dim">%</span> <span class="cmd">${escapeHtml(command)}</span>`
    );
  }

  function parseCommand(raw) {
    const tokens = [];
    const regex = /"([^"]+)"|'([^']+)'|(\S+)/g;
    let match;
    while ((match = regex.exec(raw))) {
      tokens.push(match[1] || match[2] || match[3]);
    }
    if (tokens[0] === "python" || tokens[0] === "python3") tokens.shift();
    if (tokens[0] === "task_manager.py") tokens.shift();
    return tokens;
  }

  function getFlag(tokens, name) {
    const index = tokens.indexOf(name);
    if (index === -1) return null;
    return tokens[index + 1] || null;
  }

  function listTasks(showCompleted) {
    print('<span class="dim">Pending Tasks:</span>');
    if (!state.pending.length) {
      print("No pending tasks.");
    } else {
      state.pending.forEach(function (task, i) {
        print(
          (i + 1) +
            ". <span class=\"" +
            colorClass(task.priority) +
            "\">" +
            escapeHtml(task.description) +
            "</span> - Priority: " +
            task.priority +
            ", Due: " +
            task.due_date
        );
      });
    }

    if (showCompleted) {
      print('<span class="dim">Completed Tasks:</span>');
      if (!state.completed.length) {
        print("No completed tasks.");
      } else {
        state.completed.forEach(function (task, i) {
          print((i + 1) + ". " + escapeHtml(task.description) + " - Completed");
        });
      }
    }
  }

  function resetDemo() {
    state = clone(starterTasks);
    output.innerHTML = "";
    print('<span class="dim">Demo reset. This CLI is interactive — tap a button or type a command.</span>');
    listTasks(true);
  }

  function run(raw, silentPrompt) {
    const command = String(raw || "").trim();
    if (!command) return;

    if (!silentPrompt) {
      history.push(command);
      historyIndex = history.length;
      printPrompt(command);
    }

    if (command === "reset") {
      resetDemo();
      return;
    }

    if (command === "help" || command === "-h" || command === "--help") {
      print("Working commands: add, list, complete, delete, search, prioritize, clear, reset, help");
      print('Example: add "Ship portfolio" --priority high --due-date 2026-09-20');
      print("Or tap the buttons above. Press Run after typing.");
      return;
    }

    if (command === "clear") {
      output.innerHTML = "";
      print('<span class="dim">Screen cleared. Type list or tap a command.</span>');
      return;
    }

    const tokens = parseCommand(command);
    const action = (tokens[0] || "").toLowerCase();

    if (action === "add") {
      const description = tokens[1];
      if (!description) {
        print('Usage: add "task description" --priority high --due-date 2026-09-20');
        return;
      }
      const rawPriority = getFlag(tokens, "--priority") || "low";
      const priority = rawPriority.charAt(0).toUpperCase() + rawPriority.slice(1).toLowerCase();
      const due = getFlag(tokens, "--due-date") || "No Due Date";
      state.pending.push({ description: description, priority: priority, due_date: due });
      print(
        "Task '" +
          escapeHtml(description) +
          "' added with priority '" +
          priority +
          "' and due date '" +
          due +
          "'."
      );
      return;
    }

    if (action === "list") {
      listTasks(tokens.indexOf("--show-completed") !== -1);
      return;
    }

    if (action === "complete") {
      const num = Number(tokens[1]);
      if (!num || num < 1 || num > state.pending.length) {
        print("Invalid task number. Please enter a valid number.");
        return;
      }
      const task = state.pending.splice(num - 1, 1)[0];
      state.completed.push(task);
      print("Task '" + escapeHtml(task.description) + "' marked as completed.");
      return;
    }

    if (action === "delete") {
      const num = Number(tokens[1]);
      const fromCompleted = tokens.indexOf("--completed") !== -1;
      const bucket = fromCompleted ? state.completed : state.pending;
      if (!num || num < 1 || num > bucket.length) {
        print("Invalid task number.");
        return;
      }
      const task = bucket.splice(num - 1, 1)[0];
      print(
        "Task '" +
          escapeHtml(task.description) +
          "' deleted from " +
          (fromCompleted ? "completed" : "pending") +
          " tasks."
      );
      return;
    }

    if (action === "search") {
      const keyword = (tokens[1] || "").toLowerCase();
      print('<span class="dim">Search Results:</span>');
      let found = false;
      ["pending", "completed"].forEach(function (category) {
        state[category].forEach(function (task, i) {
          if (task.description.toLowerCase().indexOf(keyword) !== -1) {
            found = true;
            print(
              category.charAt(0).toUpperCase() +
                category.slice(1) +
                " Task " +
                (i + 1) +
                ": " +
                escapeHtml(task.description) +
                " - Priority: " +
                task.priority +
                ", Due: " +
                task.due_date
            );
          }
        });
      });
      if (!found) print("No tasks found matching the keyword.");
      return;
    }

    if (action === "prioritize") {
      const order = { High: 1, Medium: 2, Low: 3 };
      state.pending.sort(function (a, b) {
        const p = (order[a.priority] || 4) - (order[b.priority] || 4);
        if (p !== 0) return p;
        const ad = a.due_date === "No Due Date" ? "9999-12-31" : a.due_date;
        const bd = b.due_date === "No Due Date" ? "9999-12-31" : b.due_date;
        return ad < bd ? -1 : ad > bd ? 1 : 0;
      });
      print("Pending tasks sorted by priority and due date.");
      listTasks(false);
      return;
    }

    print("Unknown command. Type help or tap a button above.");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    run(input.value);
    input.value = "";
    input.focus();
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
      if (!history.length) return;
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex];
      event.preventDefault();
    }
    if (event.key === "ArrowDown") {
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || "";
      event.preventDefault();
    }
  });

  if (terminal) {
    terminal.addEventListener("click", function (event) {
      if (event.target.closest("button")) return;
      input.focus();
    });
  }

  document.querySelectorAll("[data-run]").forEach(function (button) {
    button.addEventListener("click", function () {
      run(button.getAttribute("data-run"));
      input.focus();
    });
  });

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      const text = button.getAttribute("data-copy") || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
      button.textContent = "Copied";
      setTimeout(function () {
        button.textContent = "Copy";
      }, 1200);
    });
  });

  print('<span class="dim">Task Manager CLI 1.1 — this demo is live. Tap a button or type a command, then press Run.</span>');
  listTasks(true);
  input.focus();
})();
