import React, { useState } from 'react';
import { ScriptFile } from '../types';
import { FileCode, Play, Save, Check, RefreshCw, X } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface ScriptEditorModalProps {
  script: ScriptFile;
  onClose: () => void;
  onSaveScript: (updated: ScriptFile) => void;
  onExecuteScript: (script: ScriptFile) => void;
}

export const ScriptEditorModal: React.FC<ScriptEditorModalProps> = ({
  script,
  onClose,
  onSaveScript,
  onExecuteScript,
}) => {
  const [content, setContent] = useState(script.content);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveScript({
      ...script,
      content,
    });
    setSaved(true);
    soundEngine.playBlip(980);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRunNow = () => {
    handleSave();
    onExecuteScript({
      ...script,
      content,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0b0e14] border border-slate-700 rounded-xl w-full max-w-3xl h-[600px] flex flex-col shadow-2xl overflow-hidden">
        {/* Editor Title Bar */}
        <div className="h-12 bg-[#121622] border-b border-slate-800 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-4 h-4 text-amber-400" />
            <div>
              <span className="font-mono text-sm font-bold text-slate-100">
                {script.name}
              </span>
              <span className="text-[11px] font-mono text-slate-400 ml-2 hidden sm:inline">
                ({script.path})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saved ? 'Guardado' : 'Guardar'}</span>
            </button>
            <button
              onClick={handleRunNow}
              className="flex items-center gap-1 px-3 py-1 text-xs font-mono bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Guardar y Ejecutar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Code Area */}
        <div className="flex-1 p-3 bg-[#080a0f] flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full flex-1 bg-transparent font-terminal text-xs text-amber-200/90 leading-relaxed resize-none focus:outline-none p-2 selection:bg-amber-500/30"
            spellCheck={false}
          />
        </div>

        {/* Editor Footer Status */}
        <div className="h-8 bg-[#0d1017] border-t border-slate-800 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Intérprete: {script.interpreter}</span>
          <span>Líneas: {content.split('\n').length}</span>
          <span className="truncate max-w-xs">{script.description}</span>
        </div>
      </div>
    </div>
  );
};
