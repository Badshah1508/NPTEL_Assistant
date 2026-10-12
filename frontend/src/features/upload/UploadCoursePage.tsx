import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileArchive,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MOCK_UPLOAD_MANIFEST } from '../../services/mockData';
import { UploadManifestFile } from '../../types';

export const UploadCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number } | null>({
    name: 'CS801_Computer_Architecture_Lectures_W1_to_W4.zip',
    size: 14850000,
  });
  const [manifest, setManifest] = useState<UploadManifestFile[]>(MOCK_UPLOAD_MANIFEST);
  const [isProcessingStarted, setIsProcessingStarted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleWeekChange = (docId: string, newWeek: number) => {
    setManifest((prev) =>
      prev.map((item) => (item.id === docId ? { ...item, assignedWeek: newWeek } : item))
    );
  };

  const handleToggleInclude = (docId: string) => {
    setManifest((prev) =>
      prev.map((item) => (item.id === docId ? { ...item, isIncluded: !item.isIncluded } : item))
    );
  };

  const handleStartProcessing = () => {
    setIsProcessingStarted(true);
    setTimeout(() => {
      navigate('/status');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Upload Course Lecture Materials
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload a single ZIP archive containing PDF slides, PPTX presentations, DOCX handouts, or Markdown files.
          Our pipeline extracts documents, verifies lecture boundaries, and generates grounded study materials.
        </p>
      </div>

      {/* Upload Drag & Drop Zone */}
      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) {
              const file = e.dataTransfer.files[0];
              setSelectedFile({ name: file.name, size: file.size });
            }
          }}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${
            dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 bg-white hover:border-indigo-400'
          }`}
        >
          <div className="rounded-full bg-indigo-50 p-4 text-indigo-600">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">
            Drag and drop your course ZIP file here
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md">
            Supports .zip archives up to 250 MB containing PDFs, PPTX slides, Word documents, or Markdown lecture notes.
          </p>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition">
            <span>Browse Files</span>
            <input
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setSelectedFile({ name: file.name, size: file.size });
                }
              }}
            />
          </label>
        </div>
      ) : (
        /* Selected File Card */
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-600 p-2.5 text-white">
              <FileArchive className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">
                {formatSize(selectedFile.size)} • ZIP Archive Integrity Passed
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedFile(null)}
            className="mt-3 sm:mt-0 flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Replace Archive</span>
          </button>
        </div>
      )}

      {/* Archive Inspection & Manifest Review */}
      {selectedFile && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                Lecture Manifest & Week Assignment Review
              </h2>
              <p className="text-xs text-slate-500">
                Inspect extracted lecture documents. You can reassign weeks or exclude non-lecture files (e.g. syllabus notes) before generation.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {manifest.filter((m) => m.isIncluded).length} of {manifest.length} documents included
            </span>
          </div>

          {/* Manifest Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="py-3 px-3">Include</th>
                  <th className="py-3 px-3">Document Title & Filename</th>
                  <th className="py-3 px-3">Format</th>
                  <th className="py-3 px-3">Slides / Pages</th>
                  <th className="py-3 px-3">Assigned Week</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {manifest.map((doc) => (
                  <tr
                    key={doc.id}
                    className={`hover:bg-slate-50 transition ${
                      !doc.isIncluded ? 'opacity-50 bg-slate-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={doc.isIncluded}
                        onChange={() => handleToggleInclude(doc.id)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900">{doc.detectedTitle}</p>
                      <p className="text-[11px] font-mono text-slate-500">{doc.filename}</p>
                      {doc.warningMessage && (
                        <p className="mt-1 text-[10px] text-amber-700 font-medium">
                          ⚠ {doc.warningMessage}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="uppercase font-mono text-[11px] rounded bg-slate-100 px-1.5 py-0.5 text-slate-700 font-bold">
                        {doc.fileType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {doc.slideOrPageCount} slides
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={doc.assignedWeek}
                        disabled={!doc.isIncluded}
                        onChange={(e) => handleWeekChange(doc.id, parseInt(e.target.value))}
                        className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value={1}>Week 1</option>
                        <option value={2}>Week 2</option>
                        <option value={3}>Week 3</option>
                        <option value={4}>Week 4</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      {doc.status === 'valid' ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Validated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          <AlertTriangle className="h-3 w-3" />
                          Review Warning
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>
                Generation strictly complies with our <strong>Slide-Only Grounding Policy</strong>: questions are derived solely from selected week documents.
              </span>
            </div>

            <button
              onClick={handleStartProcessing}
              disabled={isProcessingStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition active:scale-95"
            >
              <span>Confirm & Start StudyPilot Pipeline</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
