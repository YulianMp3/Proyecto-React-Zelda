import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  ListFilter, 
  CheckCheck, 
  Clock, 
  Sparkles,
  Volume2,
  VolumeX,
  Shield,
  Scroll,
  Sword,
  MapPin,
  XCircle
} from 'lucide-react';

// ==========================================
// CONTROL DE AUDIO: Zelda Soundtrack
// ==========================================
class ZeldaAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.timerId = null;
  }

  initContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playNote(freq, duration, time) {
    if (!this.audioCtx || freq === 0) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.02);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  toggleMainTheme(enable) {
    this.initContext();

    if (!enable) {
      this.isPlaying = false;
      if (this.timerId) clearTimeout(this.timerId);
      if (this.audioCtx) this.audioCtx.suspend();
      return;
    }

    this.isPlaying = true;

    const N = {
      SIL: 0,
      F5: 698.46, A5: 880.00, B5: 987.77, E6: 1318.51, D6: 1174.66, C6: 1046.50, G5: 783.99, E5: 659.25, D5: 587.33
    };

    // Melodía de Lost Woods / Saria's Song
    const melody = [
      { n: N.F5, d: 0.18 }, { n: N.A5, d: 0.18 }, { n: N.B5, d: 0.36 },
      { n: N.F5, d: 0.18 }, { n: N.A5, d: 0.18 }, { n: N.B5, d: 0.36 },
      { n: N.F5, d: 0.18 }, { n: N.A5, d: 0.18 }, { n: N.B5, d: 0.18 }, { n: N.E6, d: 0.18 }, { n: N.D6, d: 0.36 },
      { n: N.B5, d: 0.18 }, { n: N.C6, d: 0.18 }, { n: N.B5, d: 0.18 }, { n: N.G5, d: 0.18 }, { n: N.E5, d: 0.54 }
    ];

    const playLoop = () => {
      if (!this.isPlaying) return;
      let startTime = this.audioCtx.currentTime + 0.05;
      let totalDuration = 0;

      melody.forEach(note => {
        this.playNote(note.n, note.d, startTime + totalDuration);
        totalDuration += note.d;
      });

      this.timerId = setTimeout(() => {
        if (this.isPlaying) playLoop();
      }, totalDuration * 1000);
    };

    playLoop();
  }

  playRupeeSound() {
    this.initContext();
    const now = this.audioCtx.currentTime;
    this.playNote(987.77, 0.08, now);
    this.playNote(1318.51, 0.15, now + 0.08);
  }

  playQuestCompleteSound() {
    this.initContext();
    const now = this.audioCtx.currentTime;
    this.playNote(523.25, 0.08, now);
    this.playNote(659.25, 0.08, now + 0.08);
    this.playNote(783.99, 0.08, now + 0.16);
    this.playNote(1046.50, 0.25, now + 0.24);
  }
}

const audioEngine = new ZeldaAudioEngine();

// SVG Trifuerza Icon
const TriforceIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L6 12h12L12 2z" />
    <path d="M6 12L0 22h12L6 12z" />
    <path d="M18 12l-6 10h12L18 12z" />
  </svg>
);

// COMPONENTE: TaskForm
function TaskForm({ onAddTask }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('principal');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onAddTask(text, category);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe la encomienda de Hyrule..."
            className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-emerald-600/50 bg-slate-900/90 text-emerald-100 placeholder-emerald-500/60 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-sm font-medium"
          />
          <Sparkles className="w-4 h-4 text-amber-400 absolute right-3 top-3.5 opacity-60" />
        </div>
        <button
          type="submit"
          className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/50 border border-emerald-300/40 transition-all cursor-pointer text-sm"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span className="hidden sm:inline">Añadir Misión</span>
        </button>
      </div>

      <div className="flex items-center gap-4 px-1 text-xs">
        <span className="text-emerald-400/80 font-semibold">Tipo de Misión:</span>
        <label className="flex items-center gap-1.5 cursor-pointer text-amber-300 font-medium">
          <input
            type="radio"
            name="category"
            value="principal"
            checked={category === 'principal'}
            onChange={() => setCategory('principal')}
            className="accent-amber-400"
          />
          <Sword className="w-3.5 h-3.5" />
          <span>Principal</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer text-emerald-300 font-medium">
          <input
            type="radio"
            name="category"
            value="secundaria"
            checked={category === 'secundaria'}
            onChange={() => setCategory('secundaria')}
            className="accent-emerald-400"
          />
          <Scroll className="w-3.5 h-3.5" />
          <span>Secundaria</span>
        </label>
      </div>
    </form>
  );
}

// COMPONENTE: TaskItem
function TaskItem({ task, onToggleTask, onDeleteTask }) {
  const isPrincipal = task.category === 'principal';

  const getItemStyles = () => {
    if (task.completed) {
      return 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/50';
    }
    return 'bg-amber-950/70 border-amber-400 text-amber-200 shadow-md shadow-amber-950/40';
  };

  return (
    <li 
      className={`group flex items-center justify-between p-4 mb-3 rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${getItemStyles()}`}
    >
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          task.completed ? 'bg-emerald-400' : 'bg-amber-400'
        }`} 
      />

      <div className="flex items-center gap-3 flex-1 mr-3 overflow-hidden pl-2">
        <button
          onClick={() => onToggleTask(task.id)}
          className={`flex-shrink-0 transition-all transform active:scale-90 cursor-pointer ${
            task.completed ? 'text-emerald-400' : 'text-amber-400'
          }`}
          title={task.completed ? "Reabrir misión" : "Marcar como completada (VERDE)"}
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 fill-emerald-950" />
          ) : (
            <Circle className="w-6 h-6 stroke-[2.5]" />
          )}
        </button>

        <div className="flex flex-col truncate">
          <span 
            onClick={() => onToggleTask(task.id)}
            className={`cursor-pointer select-none truncate text-sm sm:text-base font-semibold transition-all ${
              task.completed 
                ? 'line-through text-emerald-300/80 italic' 
                : 'text-amber-100 tracking-wide'
            }`}
          >
            {task.text}
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 mt-0.5">
            {task.completed ? (
              <span className="text-emerald-400 flex items-center gap-1"><CheckCheck className="w-3 h-3" /> Cumplida (Verde)</span>
            ) : (
              <span className="text-amber-300 flex items-center gap-1">
                {isPrincipal ? <Sword className="w-3 h-3" /> : <Scroll className="w-3 h-3" />} 
                Pendiente (Amarillo)
              </span>
            )}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDeleteTask(task.id)}
        className="text-rose-400 hover:text-rose-200 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1"
        title="Descartar / No Cumplida (ROJO)"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}

// COMPONENTE: TaskList
function TaskList({ tasks, onToggleTask, onDeleteTask, filter }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed border-rose-500/50 rounded-2xl bg-rose-950/30">
        <XCircle className="w-10 h-10 text-rose-400 mx-auto mb-2 animate-pulse" />
        <p className="text-rose-300 font-medium text-sm">
          {filter === 'all' && 'No hay encomiendas registradas.'}
          {filter === 'active' && '¡No hay misiones pendientes (Amarillo)!'}
          {filter === 'completed' && 'No se registran misiones cumplidas (Verde).'}
        </p>
      </div>
    );
  }

  return (
    <ul className="list-none p-0 m-0">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
}

// COMPONENTE: TaskFilter
function TaskFilter({ filter, setFilter }) {
  const filters = [
    { id: 'all', label: 'Todas', icon: ListFilter },
    { id: 'active', label: 'Pendientes (Amarillo)', icon: Clock },
    { id: 'completed', label: 'Cumplidas (Verde)', icon: CheckCheck },
  ];

  return (
    <div className="flex bg-slate-950/90 p-1 rounded-xl border border-emerald-800/50 gap-1 mb-6">
      {filters.map((item) => {
        const Icon = item.icon;
        const isActive = filter === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md shadow-emerald-950'
                : 'text-emerald-400/80 hover:bg-emerald-900/40'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// COMPONENTE: TaskStats
function TaskStats({ activeCount, totalCount, onClearCompleted }) {
  const completedCount = totalCount - activeCount;

  return (
    <div className="flex flex-wrap items-center justify-between pt-4 mt-4 border-t border-emerald-800/50 text-xs gap-2 font-medium">
      <div className="flex items-center gap-1.5 text-amber-300">
        <Shield className="w-4 h-4 text-amber-400" />
        <span>
          Pendientes (Amarillo): <strong className="text-amber-400 font-bold">{activeCount}</strong>
        </span>
      </div>

      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer font-semibold flex items-center gap-1"
        >
          <span>Limpiar cumplidas ({completedCount})</span>
        </button>
      )}
    </div>
  );
}

// COMPONENTE PRINCIPAL: App
export default function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('mi_todo_app_tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error("Error al cargar localStorage", e);
      }
    }
    return [
      { id: 1, text: 'Encontrar la Espada Maestra', completed: true, category: 'principal' },
      { id: 2, text: 'Derrotar a Ganon y rescatar a Zelda', completed: false, category: 'principal' },
      { id: 3, text: 'Recolectar semillas Kolog', completed: false, category: 'secundaria' }
    ];
  });

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('mi_todo_app_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleSoundAmbiance = () => {
    const newState = !isMusicPlaying;
    setIsMusicPlaying(newState);
    audioEngine.toggleMainTheme(newState);
  };

  const addTask = (text, category = 'principal') => {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false,
      category: category
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    audioEngine.playRupeeSound();
  };

  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) audioEngine.playQuestCompleteSound();
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((t) => !t.completed));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-slate-950 to-slate-950 flex flex-col justify-between py-8 px-4 font-sans text-emerald-100">
      
      <div className="max-w-lg w-full mx-auto bg-slate-900/90 rounded-3xl shadow-2xl border-2 border-emerald-500/50 p-6 sm:p-8 backdrop-blur-md relative">
        
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 px-4 py-1 rounded-full border border-amber-400/70 flex items-center gap-1 shadow-md shadow-amber-400/20">
          <TriforceIcon className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">Hyrule Quests</span>
        </div>

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-800/50 pt-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 p-2 rounded-xl shadow-md">
                <MapPin className="w-5 h-5 stroke-[2.5]" />
              </span>
              Diario de Misiones
            </h1>
          </div>

          <button
            onClick={toggleSoundAmbiance}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              isMusicPlaying 
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-950 animate-pulse' 
                : 'bg-slate-950 border-emerald-800/50 text-emerald-400/80 hover:text-emerald-200'
            }`}
            title={isMusicPlaying ? "Detener Música" : "Reproducir Música"}
          >
            {isMusicPlaying ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[10px] font-bold hidden sm:inline">Música</span>
          </button>
        </div>

        <TaskForm onAddTask={addTask} />
        <TaskFilter filter={filter} setFilter={setFilter} />
        <TaskList
          tasks={filteredTasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          filter={filter}
        />
        <TaskStats
          activeCount={activeCount}
          totalCount={tasks.length}
          onClearCompleted={clearCompleted}
        />
      </div>

      <footer className="text-center text-xs text-emerald-500/60 mt-6">
        <p>Práctica React • Zelda Theme</p>
      </footer>
    </div>
  );
}