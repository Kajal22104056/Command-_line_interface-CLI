# Task Manager CLI

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-3dff8a?style=for-the-badge)](https://kajal22104056.github.io/Command-_line_interface-CLI/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-0d1117?style=for-the-badge)](LICENSE)

A command-line task manager with priority levels, due dates, search, color-coded output, and persistent file storage.

**Live project site:** https://kajal22104056.github.io/Command-_line_interface-CLI/

---

## Why this project

This is a complete CLI product, not a single script. It uses `argparse` subcommands, validates dates, sorts work by urgency, and writes state back to `tasks.txt` only after a successful change.

Use it on a resume as:

> Built a Python CLI task manager with argparse, persistent storage, priority-based sorting, search, and a live interactive demo.

---

## Features

- Add tasks with `Low`, `Medium`, or `High` priority
- Optional due dates in `YYYY-MM-DD`
- Color-coded list output: High red, Medium yellow, Low green
- Complete or delete tasks from pending or completed lists
- Search across both lists
- Sort pending tasks by priority, then due date
- Persistent storage in `tasks.txt`
- Zero third-party dependencies

---

## Quick start

```bash
git clone https://github.com/Kajal22104056/Command-_line_interface-CLI.git
cd Command-_line_interface-CLI
python3 task_manager.py list --show-completed
```

---

## Commands

```bash
python3 task_manager.py add "Ship portfolio" --priority high --due-date 2026-09-20
python3 task_manager.py list
python3 task_manager.py list --show-completed
python3 task_manager.py complete 1
python3 task_manager.py delete 2
python3 task_manager.py delete 1 --completed
python3 task_manager.py search resume
python3 task_manager.py prioritize
python3 task_manager.py --help
```

---

## How it works

1. `argparse` parses the subcommand and flags.
2. `load_tasks()` reads `tasks.txt` into pending and completed lists.
3. The selected command updates in-memory state.
4. Successful mutations are written back with `save_tasks()`.

```
[Completed] Setup Python environment | Medium | 2026-09-01
Submit assignment | High | 2026-09-10
```

---

## Project structure

```
Command-_line_interface-CLI
├── task_manager.py   # CLI application
├── tasks.txt         # Persistent task store
├── index.html        # Live project website
├── assets/           # Website styles and interactive demo
└── README.md
```

---

## Resume bullets

- Built a Python CLI task manager with argparse subcommands for add, list, complete, delete, search, and priority-based sorting.
- Implemented persistent file storage and input validation so invalid dates never corrupt saved tasks.
- Shipped a live GitHub Pages demo so reviewers can try the workflow in the browser.

---

## Tech

Python 3 · argparse · datetime · ANSI colors · File I/O · GitHub Pages
