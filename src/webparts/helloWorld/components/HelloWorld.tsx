
import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './HelloWorld.module.scss';
import type { IHelloWorldProps } from './IHelloWorldProps';


type ToDoId = string;

interface IToDoItem {
  id: ToDoId;
  title: string;
  done: boolean;
  createdAt: number;
}

const HelloWorld: React.FC<IHelloWorldProps> = ({
 
description,
  isDarkTheme,
  environmentMessage,
  hasTeamsContext,
  userName,
  userRole

}) => {


  // --- In-memory state ---
  const [items, setItems] = useState<IToDoItem[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  
  // Derived counts
  const total = items.length;
  const completedCount = useMemo(
    () => items.reduce((acc, it) => acc + (it.done ? 1 : 0), 0),
    [items]
  );
  const activeCount = total - completedCount;


 // Filtered view
  const visibleItems = useMemo(() => {
    switch (filter) {
      case 'active':
        return items.filter(i => !i.done);
      case 'completed':
        return items.filter(i => i.done);
      default:
        return items;
    }
  }, [items, filter]);

  
  // Handlers
  const addItem = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const item: IToDoItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: trimmed,
      done: false,
      createdAt: Date.now()
    };
    setItems(prev => [item, ...prev]);
    setNewTitle('');
  };

  const toggleItem = (id: ToDoId) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, done: !i.done } : i)));
  };
//how delete works??
  const deleteItem = (id: ToDoId) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const renameItem = (id: ToDoId, title: string) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, title } : i)));
  };


 const clearCompleted = () => {
    setItems(prev => prev.filter(i => !i.done));
  };

  // Example effect: log when list changes (dev aid)
  useEffect(() => {
    // Runs whenever the list changes
    // console.log('ToDo items updated:', items);
  }, [items]);


 
return (
    <section className={`${styles.helloWorld} ${hasTeamsContext ? styles.teams : ''}`}>
      <div className={styles.welcome}>
        <img
          alt=""
          src={
            isDarkTheme
              ? require('../assets/welcome-dark.png')
              : require('../assets/welcome-light.png')
       
  }
          className={styles.welcomeImage}
        />
        <h2>Hello, {escape(userName)}!</h2>
        <div>{environmentMessage}</div>
        <div>
          Web part property value: <strong>{escape(description)}</strong>
        </div>
      </div>


      {/* --- In-memory To-Do --- */}
      <div className={styles.todoContainer}>
        <h3 className={styles.todoTitle}>Your Role is {userRole}</h3>

        <form
          className={styles.todoForm}
          onSubmit={(e) => {

   e.preventDefault();
            addItem(newTitle);
          }}
        >
          <input
            type="text"
            placeholder="Add a new task…"
            aria-label="New task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={styles.todoInput}
          />
          <button type="submit" className={styles.todoAddBtn}>
            Add

  </button>
        </form>

        <div className={styles.todoToolbar}>
          <span className={styles.todoCounts}>
            Total: {total} • Active: {activeCount} • Completed: {completedCount}
          </span>

          <div className={styles.todoFilters} role="group" aria-label="Filter tasks">
            <button
              className={`${styles.todoFilterBtn} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}

  >
              All
            </button>
            <button
              className={`${styles.todoFilterBtn} ${filter === 'active' ? styles.active : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`${styles.todoFilterBtn} ${filter === 'completed' ? styles.active : ''}`}
              onClick={() => setFilter('completed')}
            >

    Completed
            </button>

            <button
              className={styles.todoClearBtn}
              onClick={clearCompleted}
              disabled={completedCount === 0}
              title="Remove all completed tasks"
            >
              Clear Completed
            </button>
          </div>
        </div>

  {visibleItems.length === 0 ? (
          <p className={styles.todoEmpty}>No tasks in this view.</p>
        ) : (
          <ul className={styles.todoList}>
            {visibleItems.map((item) => (
              <li key={item.id} className={styles.todoItem}>
                <label className={styles.todoCheckboxLabel}>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleItem(item.id)}
                    aria-checked={item.done}
                    aria-label={item.title}
                  />

  <span className={styles.todoCheckboxText}>
                    {item.done ? '✔' : ''}
                  </span>
                </label>

                <input
                  className={`${styles.todoItemTitle} ${item.done ? styles.todoDone : ''}`}
                  value={item.title}
                  onChange={(e) => renameItem(item.id, e.target.value)}
                  aria-label={`Edit title for ${item.title}`}
                />

    <button
                  className={styles.todoDeleteBtn}
                  onClick={() => deleteItem(item.id)}
                  aria-label={`Delete ${item.title}`}
                  title="Delete task"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>

  );
};

export default HelloWorld;
