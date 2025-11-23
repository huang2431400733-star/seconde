import React, { useState, KeyboardEvent } from 'react';
import { Plus, Check, Trash2, Wand2 } from 'lucide-react';
import { Todo, FilterType } from '../../types';
import { generateTodoSuggestion } from '../../services/geminiService';

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: '查看最新的技术论坛', completed: true, createdAt: Date.now() },
    { id: '2', text: '完善个人资料', completed: false, createdAt: Date.now() },
    { id: '3', text: '回复一条评论', completed: false, createdAt: Date.now() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addTodo(inputValue);
  };

  const handleAiSuggest = async () => {
      setIsSuggesting(true);
      try {
          const existingTasks = todos.map(t => t.text);
          const suggestion = await generateTodoSuggestion(existingTasks);
          setInputValue(suggestion);
      } finally {
          setIsSuggesting(false);
      }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.ACTIVE) return !todo.completed;
    if (filter === FilterType.COMPLETED) return todo.completed;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">待办事项</h2>
          <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-600 rounded-md">
            {todos.filter(t => !t.completed).length} 待办
          </span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="添加新任务..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            <button 
                onClick={handleAiSuggest}
                disabled={isSuggesting}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                title="AI 建议"
            >
                {isSuggesting ? <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div> : <Wand2 size={18} />}
            </button>
          </div>
          <button
            onClick={() => addTodo(inputValue)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors shadow-lg shadow-indigo-200"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        {(Object.keys(FilterType) as Array<keyof typeof FilterType>).map((key) => (
            <button
                key={key}
                onClick={() => setFilter(FilterType[key])}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    filter === FilterType[key]
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-500 hover:bg-slate-200'
                }`}
            >
                {FilterType[key]}
            </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[300px]">
        {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <p>暂无任务</p>
            </div>
        ) : (
            filteredTodos.map(todo => (
            <div
                key={todo.id}
                className="group flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors animate-in fade-in duration-300"
            >
                <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    todo.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-300 text-transparent hover:border-indigo-500'
                }`}
                >
                <Check size={14} strokeWidth={3} />
                </button>
                
                <span className={`flex-1 text-sm font-medium transition-all ${
                todo.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'
                }`}>
                {todo.text}
                </span>

                <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"
                >
                <Trash2 size={16} />
                </button>
            </div>
            ))
        )}
      </div>
    </div>
  );
};
