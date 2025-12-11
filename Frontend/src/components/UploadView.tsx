import React, { useState } from 'react';
import { Card } from './ui/card';
import { Upload, File, X, CheckCircle, AlertCircle, Sparkles, FileText } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

export function UploadView() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'patient_report_2025.pdf',
      size: '2.4 MB',
      status: 'success',
      progress: 100
    },
    {
      id: '2',
      name: 'lab_results_oct.csv',
      size: '856 KB',
      status: 'success',
      progress: 100
    }
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: files[0].name,
      size: `${(files[0].size / (1024 * 1024)).toFixed(2)} MB`,
      status: 'uploading',
      progress: 0
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        setUploadedFiles(prev => 
          prev.map(f => f.id === newFile.id ? { ...f, progress } : f)
        );
      }
      if (progress === 100) {
        setUploadedFiles(prev => 
          prev.map(f => f.id === newFile.id ? { ...f, status: 'success' } : f)
        );
        clearInterval(interval);
      }
    }, 200);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-purple-400 neon-text-purple">Upload Medical Reports</h2>
        <p className="text-sm text-gray-400 mt-2">Upload patient reports for AI-powered analysis and validation</p>
      </div>

      {/* Upload Area */}
      <Card className="p-8 bg-black/60 backdrop-blur-xl neon-border-purple">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            dragActive
              ? 'border-purple-500 bg-purple-500/10 scale-[1.02] neon-glow-purple'
              : 'border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/5'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center neon-glow-purple animate-neon-pulse">
              <Upload size={36} className="text-white" />
            </div>
            
            <div>
              <h4 className="text-white mb-2">Drop your files here or click to browse</h4>
              <p className="text-sm text-gray-400">
                Supports: PDF, CSV, XLSX, JSON (Max 10MB per file)
              </p>
            </div>

            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.csv,.xlsx,.json"
              />
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all neon-glow-purple hover:scale-[1.02] transform">
                <Upload size={18} />
                Select Files
              </span>
            </label>
          </div>
        </div>
      </Card>

      {/* Upload Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-black/60 border border-cyan-500/30 backdrop-blur-xl neon-glow-cyan hover:scale-[1.02] transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 neon-glow-cyan">
              <FileText size={20} className="text-black" />
            </div>
            <div>
              <h4 className="text-white mb-1">Supported Formats</h4>
              <p className="text-sm text-gray-400">PDF, CSV, Excel, JSON files are supported</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/60 border border-pink-500/30 backdrop-blur-xl neon-glow-pink hover:scale-[1.02] transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 neon-glow-pink">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-white mb-1">AI Processing</h4>
              <p className="text-sm text-gray-400">Automatic analysis and validation on upload</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/60 border border-green-500/30 backdrop-blur-xl neon-glow-green hover:scale-[1.02] transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 neon-glow-green">
              <CheckCircle size={20} className="text-black" />
            </div>
            <div>
              <h4 className="text-white mb-1">Secure Storage</h4>
              <p className="text-sm text-gray-400">Encrypted and HIPAA-compliant storage</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-purple">
          <h3 className="text-purple-400 neon-text-purple mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-gray-700 hover:border-purple-500/50 hover:bg-black/60 transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  file.status === 'success' 
                    ? 'bg-gradient-to-br from-green-400 to-green-500 neon-glow-green' 
                    : file.status === 'error'
                    ? 'bg-gradient-to-br from-pink-500 to-pink-600 neon-glow-pink'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-500 neon-glow-cyan'
                }`}>
                  {file.status === 'success' ? (
                    <CheckCircle size={20} className="text-black" />
                  ) : file.status === 'error' ? (
                    <AlertCircle size={20} className="text-white" />
                  ) : (
                    <File size={20} className="text-black" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm text-white truncate">{file.name}</h4>
                    <span className="text-xs text-gray-500 ml-2">{file.size}</span>
                  </div>
                  
                  {file.status === 'uploading' && (
                    <div className="w-full h-2 bg-black/60 border border-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 neon-glow-cyan"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {file.status === 'success' && (
                    <p className="text-xs text-green-400">Upload complete • Ready for analysis</p>
                  )}
                </div>

                <button
                  onClick={() => removeFile(file.id)}
                  className="p-2 hover:bg-pink-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={16} className="text-pink-500" />
                </button>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all neon-glow-purple hover:scale-[1.02] transform">
            Process All Files
          </button>
        </Card>
      )}
    </div>
  );
}
