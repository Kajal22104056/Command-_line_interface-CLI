# Task Manager CLI

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-3dff8a?style=for-the-badge)](https://kajal22104056.github.io/Command-_line_interface-CLI/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-0d1117?style=for-the-badge)](LICENSE)

A lightweight Python command-line tool for managing tasks with priorities, due dates, search, and persistent storage.

**Live demo:** https://kajal22104056.github.io/Command-_line_interface-CLI/

---

## Features

| Feature | What it does |
| --- | --- |
| Add tasks | Create a task with optional `low` / `medium` / `high` priority and a due date |
| Color-coded list | High is red, Medium is yellow, Low is green |
| Complete / delete | Move a pending task to completed, or remove it from either list |
| Search | Find a keyword across pending and completed tasks |
| Prioritize | Sort pending tasks by priority, then nearest due date |
| Persistence | Saves everything to `tasks.txt` so data survives across sessions |
| Safe writes | Invalid task numbers or dates never overwrite the store |
| Zero dependencies | Uses only the Python standard library |

---

## Requirements

- Python 3.9 or newer
- A terminal

No `pip install` is required.

---

## Installation

```bash
git clone https://github.com/Kajal22104056/Command-_line_interface-CLI.git
cd Command-_line_interface-CLI
python3 task_manager.py --help
```

You can also run the file directly:

```bash
chmod +x task_manager.py
./task_manager.py list
```

---

## Usage

```text
python3 task_manager.py <command> [options]
```

### Add a task

```bash
python3 task_manager.py add "Ship portfolio" --priority high --due-date 2026-09-20
python3 task_manager.py add "Read argparse docs"
```

- `--priority` accepts `low`, `medium`, or `high`. Default is `low`.
- `--due-date` must be `YYYY-MM-DD`. If omitted, the task is stored as `No Due Date`.

### List tasks

```bash
python3 task_manager.py list
python3 task_manager.py list --show-completed
```

### Complete a task

```bash
python3 task_manager.py complete 1
```

The number is the pending-task index shown by `list`.

### Delete a task

```bash
python3 task_manager.py delete 2
python3 task_manager.py delete 1 --completed
```

### Search

```bash
python3 task_manager.py search portfolio
```

### Sort by urgency

```bash
python3 task_manager.py prioritize
```

Pending tasks are ordered High → Medium → Low, then by due date. Tasks without a date go last.

---

## Example session

```bash
python3 task_manager.py add "Submit assignment" --priority high --due-date 2026-09-10
python3 task_manager.py add "Update resume" --priority medium --due-date 2026-09-12
python3 task_manager.py add "Read argparse docs"
python3 task_manager.py prioritize
python3 task_manager.py list --show-completed
python3 task_manager.py complete 1
python3 task_manager.py search resume
```

Sample output:

```text
Pending Tasks:
1. Submit assignment - Priority: High, Due: 2026-09-10
2. Update resume - Priority: Medium, Due: 2026-09-12
3. Read argparse docs - Priority: Low, Due: No Due Date
```

---

## How it works

```text
terminal
   │
   ▼
argparse  →  load tasks.txt  →  run command  →  save tasks.txt
```

1. `argparse` parses the subcommand and validates flags, including due dates.
2. `load_tasks()` reads `tasks.txt` into pending and completed lists.
3. The selected command updates state in memory.
4. Successful changes are written back with `save_tasks()`. Failed input is rejected and the file is left untouched.

### Storage format

Each line in `tasks.txt` is:

```text
description | priority | due_date
```

Completed tasks are prefixed with `[Completed]`:

```text
Submit assignment | High | 2026-09-10
[Completed] Setup Python environment | Medium | 2026-09-01
```

---

## Project structure

```text
Command-_line_interface-CLI
├── task_manager.py    CLI application
├── tasks.txt          Persistent task store
├── index.html         Project website
├── assets/            Live demo styles and scripts
├── LICENSE
└── README.md
```

---

## Tech stack

- Python 3
- `argparse` for subcommands and help text
- `datetime` for due-date validation
- ANSI escape codes for color output
- File I/O for persistence
- GitHub Pages for the live demo

---

## License

MIT. See [LICENSE](LICENSE).
