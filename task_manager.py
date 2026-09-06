#!/usr/bin/env python3
"""Task Manager CLI — add, list, complete, search, and prioritize tasks."""

import argparse
import os
from datetime import datetime

TASK_FILE = "tasks.txt"
PRIORITY_ORDER = {"High": 1, "Medium": 2, "Low": 3}
ANSI = {
    "red": "\033[91m",
    "yellow": "\033[93m",
    "green": "\033[92m",
    "dim": "\033[90m",
    "end": "\033[0m",
}
PRIORITY_COLOR = {"High": "red", "Medium": "yellow", "Low": "green"}


def colored(text, color):
    return f"{ANSI.get(color, '')}{text}{ANSI['end']}"


def load_tasks():
    """Load pending and completed tasks from the local store."""
    tasks = {"pending": [], "completed": []}
    if not os.path.exists(TASK_FILE):
        return tasks

    with open(TASK_FILE, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line:
                continue
            completed = line.startswith("[Completed]")
            payload = line.replace("[Completed] ", "", 1) if completed else line
            parts = [part.strip() for part in payload.split(" | ")]
            if len(parts) < 3:
                continue
            task = {
                "description": parts[0],
                "priority": parts[1],
                "due_date": parts[2],
            }
            bucket = "completed" if completed else "pending"
            tasks[bucket].append(task)
    return tasks


def save_tasks(tasks):
    """Persist tasks so they survive across sessions."""
    with open(TASK_FILE, "w", encoding="utf-8") as file:
        for task in tasks["pending"]:
            file.write(f"{task['description']} | {task['priority']} | {task['due_date']}\n")
        for task in tasks["completed"]:
            file.write(f"[Completed] {task['description']} | {task['priority']} | {task['due_date']}\n")


def parse_due_date(value):
    if not value:
        return "No Due Date"
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        raise argparse.ArgumentTypeError("Due date must be YYYY-MM-DD.")
    return value


def add_task(tasks, description, priority="Low", due_date="No Due Date"):
    task = {
        "description": description,
        "priority": priority.capitalize(),
        "due_date": due_date or "No Due Date",
    }
    tasks["pending"].append(task)
    print(
        f"Task '{description}' added with priority '{task['priority']}' "
        f"and due date '{task['due_date']}'."
    )


def view_tasks(tasks, show_completed=False):
    print("\nPending Tasks:")
    if not tasks["pending"]:
        print("No pending tasks.")
    else:
        for idx, task in enumerate(tasks["pending"], 1):
            color = PRIORITY_COLOR.get(task["priority"], "end")
            print(
                f"{idx}. {colored(task['description'], color)} - "
                f"Priority: {task['priority']}, Due: {task['due_date']}"
            )

    if show_completed:
        print("\nCompleted Tasks:")
        if not tasks["completed"]:
            print("No completed tasks.")
        else:
            for idx, task in enumerate(tasks["completed"], 1):
                print(f"{idx}. {task['description']} - Completed")


def mark_task_complete(tasks, task_num):
    if 1 <= task_num <= len(tasks["pending"]):
        task = tasks["pending"].pop(task_num - 1)
        tasks["completed"].append(task)
        print(f"Task '{task['description']}' marked as completed.")
        return True
    print("Invalid task number. Please enter a valid number.")
    return False


def delete_task(tasks, task_num, from_completed=False):
    bucket = "completed" if from_completed else "pending"
    label = "completed" if from_completed else "pending"
    if 1 <= task_num <= len(tasks[bucket]):
        task = tasks[bucket].pop(task_num - 1)
        print(f"Task '{task['description']}' deleted from {label} tasks.")
        return True
    print("Invalid task number.")
    return False


def prioritize_tasks(tasks):
    tasks["pending"].sort(
        key=lambda t: (
            PRIORITY_ORDER.get(t["priority"], 4),
            t["due_date"] if t["due_date"] != "No Due Date" else "9999-12-31",
        )
    )
    print("Pending tasks sorted by priority and due date.")


def search_tasks(tasks, keyword):
    print("\nSearch Results:")
    found = False
    for category in ("pending", "completed"):
        for idx, task in enumerate(tasks[category], 1):
            if keyword.lower() in task["description"].lower():
                print(
                    f"{category.capitalize()} Task {idx}: {task['description']} - "
                    f"Priority: {task['priority']}, Due: {task['due_date']}"
                )
                found = True
    if not found:
        print("No tasks found matching the keyword.")


def build_parser():
    parser = argparse.ArgumentParser(
        prog="task_manager.py",
        description="A lightweight CLI to manage tasks with priority, due dates, and search.",
    )
    parser.add_argument("--version", action="version", version="Task Manager CLI 1.1")
    subparsers = parser.add_subparsers(dest="command")

    add_parser = subparsers.add_parser("add", help="Add a new task")
    add_parser.add_argument("description", help="Task description")
    add_parser.add_argument(
        "--priority",
        choices=["low", "medium", "high"],
        default="low",
        help="Priority of the task. Default: low.",
    )
    add_parser.add_argument(
        "--due-date",
        type=parse_due_date,
        help="Optional due date in YYYY-MM-DD format.",
    )

    list_parser = subparsers.add_parser("list", help="List tasks")
    list_parser.add_argument(
        "--show-completed",
        action="store_true",
        help="Include completed tasks in the output.",
    )

    complete_parser = subparsers.add_parser("complete", help="Mark a pending task as completed")
    complete_parser.add_argument("task_num", type=int, help="Pending task number")

    delete_parser = subparsers.add_parser("delete", help="Delete a task")
    delete_parser.add_argument("task_num", type=int, help="Task number to delete")
    delete_parser.add_argument(
        "--completed",
        action="store_true",
        help="Delete from the completed list instead of pending.",
    )

    search_parser = subparsers.add_parser("search", help="Search tasks by keyword")
    search_parser.add_argument("keyword", help="Keyword to match in task descriptions")

    subparsers.add_parser("prioritize", help="Sort pending tasks by priority and due date")
    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()
    tasks = load_tasks()

    if args.command == "add":
        add_task(tasks, args.description, args.priority, args.due_date)
        save_tasks(tasks)
    elif args.command == "list":
        view_tasks(tasks, show_completed=args.show_completed)
    elif args.command == "complete":
        if mark_task_complete(tasks, args.task_num):
            save_tasks(tasks)
    elif args.command == "delete":
        if delete_task(tasks, args.task_num, from_completed=args.completed):
            save_tasks(tasks)
    elif args.command == "search":
        search_tasks(tasks, args.keyword)
    elif args.command == "prioritize":
        prioritize_tasks(tasks)
        save_tasks(tasks)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
