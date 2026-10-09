import React, { useState, useRef, useEffect } from 'react';
import { ScriptFile, TerminalLine } from '../types';
import { Play, Terminal as TermIcon, FileCode, Trash2, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { RETRO_ASCII_EMBLEMS } from '../data/defaultScripts';

interface TerminalConsoleProps {
  scripts: ScriptFile[];
  onExecuteScript: (script: ScriptFile) => void;
  terminalLogs: TerminalLine[];
  onClearLogs: () => void;
  activeScriptExecuting: string | null;
  onOpenScriptEditor: (script: ScriptFile) => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  scripts,
  onExecuteScript,
  terminalLogs,
  onClearLogs,
  activeScriptExecuting,
  onOpenScriptEditor,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    soundEngine.playKeyClick();
    setHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);
    setInputVal('');

    const lower = cmd.toLowerCase();

    // Command parser
    if (lower === 'clear' || lower === 'cls') {
      onClearLogs();
      return;
    }

    if (lower === 'help') {
      const helpText = `Comandos disponibles en el shell SNBV™:
  run <script>      - Ejecutar un script (.sh)
  cat <script>      - Mostrar contenido de un script
  ls / dir          - Listar scripts en C:\\Documentos\\SERGIO Berlanga\\DAILY\\
  apple             - Ejecutar APPLE™_ITʼS.BACK™.sh
  colours           - Ejecutar COLOURS_ACTIVATION.sh
  deploy            - Ejecutar COLOURS_DEPLOYMENT.sh
  fleet             - Lanzar Naves_Espaciales_de_Colores™
  tu_script         - Ejecutar tu_script.sh
  emblems           - Mostrar emblemas geométricos SNBV™
  clear             - Limpiar la pantalla de la terminal`;
      // We can push system lines directly via terminal dispatch or execution
      const targetScript = scripts[0];
      if (targetScript) {
        onExecuteScript({
          ...targetScript,
          id: 'help_manual',
          name: 'help',
          content: helpText,
          description: 'Ayuda del sistema',
        });
      }
      return;
    }

    if (lower === 'ls' || lower === 'dir') {
      const listText = scripts
        .map((s) => `  -rwxr-xr-x 1 sergio staff  1024  [Bash]  ${s.name}`)
        .join('\n');
      const targetScript = scripts[0];
      if (targetScript) {
        onExecuteScript({
          ...targetScript,
          id: 'ls_output',
          name: 'ls -la',
          content: `Contenido de C:\\Documentos\\SERGIO Berlanga\\DAILY\\:\n${listText}`,
          description: 'Lista de scripts',
        });
      }
      return;
    }

    // Match execution commands
    const matchingScript = scripts.find(
      (s) =>
        lower === s.name.toLowerCase() ||
        lower === `run ${s.name.toLowerCase()}` ||
        lower === `bash ${s.name.toLowerCase()}` ||
        lower === `./${s.name.toLowerCase()}` ||
        (lower.includes('apple') && s.id === 'apple_its_back') ||
        (lower.includes('deploy') && s.id === 'colours_deployment') ||
        (lower.includes('activat') && s.id === 'colours_activation') ||
        (lower.includes('naves') && s.id === 'naves_espaciales') ||
        (lower.includes('tu_script') && s.id === 'tu_script')
    );

    if (matchingScript) {
      onExecuteScript(matchingScript);
    } else {
      // Command not found
      const notFoundScript = scripts[0];
      if (notFoundScript) {
        onExecuteScript({
          ...notFoundScript,
          id: 'cmd_not_found',
          name: cmd,
          content: `bash: ${cmd}: orden no encontrada. Escriba 'help' o 'ls' para ver los scripts disponibles en C:\\Documentos\\SERGIO Berlanga\\DAILY\\.`,
          description: 'Error de comando',
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx >= history.length) {
          setHistoryIdx(-1);
          setInputVal('');
        } else {
          setHistoryIdx(nextIdx);
          setInputVal(history[nextIdx] || '');
        }
      }
    }
  };

  const exportLogs = () => {
    const textContent = terminalLogs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SNBV_Terminal_Logs_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    soundEngine.playBlip(900);
  };

  return (
    <div className="w-full bg-[#0a0d14] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[620px]">
      {/* Terminal Title Bar */}
      <div className="h-11 bg-[#10141f] border-b border-slate-800 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#E03A3E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FDB827] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#61BB46] inline-block" />
          </div>
          <span className="font-mono text-slate-300 font-semibold tracking-wide flex items-center gap-1.5">
            <TermIcon className="w-3.5 h-3.5 text-amber-400" />
            C:\Documentos\SERGIO Berlanga\DAILY [ Bash ]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeScriptExecuting && (
            <span className="text-[11px] font-mono text-amber-400 animate-pulse flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Ejecutando {activeScriptExecuting}...
            </span>
          )}

          <button
            onClick={exportLogs}
            title="Descargar registro de terminal"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClearLogs}
            title="Limpiar pantalla"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Script Execution Toolbar */}
      <div className="bg-[#0d1017] border-b border-slate-800/80 px-3 py-2 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
        <span className="text-slate-500 uppercase tracking-wider text-[10px] shrink-0">
          Scripts DAILY:
        </span>
        {scripts.map((script) => (
          <div
            key={script.id}
            className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded px-2 py-1 shrink-0 transition-colors"
          >
            <button
              onClick={() => onExecuteScript(script)}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              title={`Ejecutar ${script.name}`}
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>{script.name}</span>
            </button>
            <button
              onClick={() => onOpenScriptEditor(script)}
              className="text-slate-500 hover:text-slate-300 pl-1 border-l border-slate-800"
              title={`Ver o editar código fuente de ${script.name}`}
            >
              <FileCode className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Terminal Screen / Log Output */}
      <div
        className="flex-1 p-4 overflow-y-auto font-terminal text-xs text-slate-300 space-y-1.5 select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {terminalLogs.map((log) => {
          if (log.type === 'command') {
            return (
              <div key={log.id} className="flex items-start gap-2 text-amber-300 pt-1">
                <span className="text-slate-500 select-none">$</span>
                <span className="font-bold">{log.text}</span>
              </div>
            );
          }

          if (log.type === 'banner') {
            return (
              <pre
                key={log.id}
                className="text-amber-400/90 font-terminal leading-tight py-1 my-1 overflow-x-auto"
              >
                {log.text}
              </pre>
            );
          }

          if (log.type === 'success') {
            return (
              <div key={log.id} className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{log.text}</span>
              </div>
            );
          }

          if (log.type === 'stderr') {
            return (
              <div key={log.id} className="text-rose-400">
                {log.text}
              </div>
            );
          }

          if (log.type === 'system') {
            return (
              <div key={log.id} className="text-cyan-400/90 italic">
                {log.text}
              </div>
            );
          }

          // Default stdout
          return (
            <div key={log.id} className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {log.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Command Prompt Input */}
      <form
        onSubmit={handleCommandSubmit}
        className="h-11 bg-[#0b0e14] border-t border-slate-800 px-3 flex items-center gap-2"
      >
        <span className="text-emerald-400 font-terminal text-xs select-none whitespace-nowrap">
          sergio@snbv-station:~/DAILY$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escriba un comando o script (ej. run APPLE™_ITʼS.BACK™.sh, ls, help)..."
          className="flex-1 bg-transparent text-xs font-terminal text-slate-100 placeholder:text-slate-600 focus:outline-none"
        />
        <button
          type="submit"
          className="px-2.5 py-1 text-[11px] font-mono text-slate-900 bg-amber-400 hover:bg-amber-300 rounded font-semibold transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};
