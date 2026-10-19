/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  FileCode,
  Download,
  Copy,
  Check,
  FolderTree,
  Terminal,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_FILES } from './data/skillFiles';

export default function App() {
  const [selectedFileKey, setSelectedFileKey] = useState<string>('README.md');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const activeFile = INITIAL_FILES[selectedFileKey] || INITIAL_FILES['README.md'];

  const handleCopySingle = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAll = () => {
    const combined = Object.entries(INITIAL_FILES)
      .map(([name, item]) => `### FILE: ${item.path}\n\n${item.content}\n\n${'='.repeat(60)}\n`)
      .join('\n');
    navigator.clipboard.writeText(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Write to both root and notebook-rag-knowledgebase folder inside the zip for maximum user convenience
      const rootFolder = zip.folder("notebook-rag-knowledgebase");
      Object.entries(INITIAL_FILES).forEach(([path, file]) => {
        rootFolder?.file(path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'notebook-rag-knowledgebase.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono text-xs flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold text-white tracking-tight">
            notebook-rag-knowledgebase
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
            Tri-Agent: Claude • ChatGPT • Gemini
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied All Files' : 'Copy All Files'}</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition shadow disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Archiving...' : 'Download Repository (.ZIP)'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar File List */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900/50 p-4 overflow-y-auto space-y-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Repository Files</span>
              <span className="text-slate-500">{Object.keys(INITIAL_FILES).length} files</span>
            </div>

            <div className="space-y-1">
              {Object.entries(INITIAL_FILES).map(([key, file]) => {
                const isSelected = key === selectedFileKey;
                const platformBadge =
                  file.platform === 'Claude'
                    ? 'bg-purple-950/80 text-purple-300 border-purple-800/60'
                    : file.platform === 'ChatGPT'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                    : file.platform === 'Gemini'
                    ? 'bg-blue-950/80 text-blue-300 border-blue-800/60'
                    : 'bg-slate-800 text-slate-400 border-slate-700';

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedFileKey(key)}
                    className={`w-full text-left p-2 rounded flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/40 text-blue-200'
                        : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span className="truncate">{key}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${platformBadge}`}>
                      {file.platform}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Platform Integration Guide */}
          <div className="pt-3 border-t border-slate-800 text-[11px] space-y-2">
            <div className="font-semibold text-slate-400 uppercase tracking-wider">How to Use</div>
            <div className="space-y-1 text-slate-400 leading-relaxed">
              <p><span className="text-blue-300 font-bold">Gemini:</span> Use <code className="text-slate-300">SKILL.md</code> via <code className="text-slate-300">gemini skills install</code>.</p>
              <p><span className="text-purple-300 font-bold">Claude:</span> Add <code className="text-slate-300">CLAUDE.md</code> to project root or use <code className="text-slate-300">mcp.json</code>.</p>
              <p><span className="text-emerald-300 font-bold">ChatGPT:</span> Paste <code className="text-slate-300">gpt-instructions.md</code> in Custom GPT & import <code className="text-slate-300">openapi.yaml</code>.</p>
              <p><span className="text-slate-300 font-bold">Universal:</span> <code className="text-slate-300">AGENTS.md</code> applies across Cursor, Windsurf, Codex.</p>
            </div>
          </div>
        </aside>

        {/* File Content Preview */}
        <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="font-semibold text-slate-200">{activeFile.path}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{activeFile.description}</span>
            </div>

            <button
              onClick={() => handleCopySingle(activeFile.content, selectedFileKey)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              {copiedKey === selectedFileKey ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4 text-slate-300 leading-relaxed">
            <pre className="font-mono text-[12px] whitespace-pre-wrap selection:bg-blue-600 selection:text-white">
              {activeFile.content}
            </pre>
          </div>
        </main>
      </div>
    </div>
  );
}
