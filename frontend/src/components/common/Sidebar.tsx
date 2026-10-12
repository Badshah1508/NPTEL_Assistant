import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  HelpCircle,
  PlayCircle,
  MessageSquare,
  UploadCloud,
  Activity,
  BarChart3,
  Settings,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeWeek: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeWeek }) => {
  const navSections = [
    {
      title: 'Course Navigation',
      items: [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/course', label: 'Course Workspace', icon: FolderKanban },
      ],
    },
    {
      title: `Week ${activeWeek} Study & Practice`,
      items: [
        {
          to: '/notes',
          label: 'Weekly Short Notes',
          icon: FileText,
          badge: '100% Coverage',
          badgeColor: 'bg-emerald-100 text-emerald-800',
        },
        {
          to: '/questions',
          label: '50 Practice Questions',
          icon: HelpCircle,
          badge: activeWeek === 1 ? '50 / 50' : '42 / 50',
          badgeColor: activeWeek === 1 ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800',
        },
        {
          to: '/mock-test',
          label: 'Interactive Mock Test',
          icon: PlayCircle,
        },
        {
          to: '/chat',
          label: 'Ask AI (Slide Grounded)',
          icon: MessageSquare,
          badge: 'RAG',
          badgeColor: 'bg-purple-100 text-purple-800',
        },
      ],
    },
    {
      title: 'Pipelines & System',
      items: [
        { to: '/upload', label: 'Upload Materials ZIP', icon: UploadCloud },
        {
          to: '/status',
          label: 'Processing Pipeline',
          icon: Activity,
          badge: 'Step 8/10',
          badgeColor: 'bg-blue-100 text-blue-800',
        },
      ],
    },
    {
      title: 'Analytics & Preferences',
      items: [
        { to: '/progress', label: 'Progress & Weak Areas', icon: BarChart3 },
        { to: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto px-4 py-5">
          <div className="space-y-6">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </h3>
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 shrink-0 transition group-hover:text-indigo-600" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Strict Grounding Policy Card */}
          <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-xs text-indigo-900">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span>Slide-Only Grounding</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-indigo-700/90">
              Questions & answers are strictly verified against uploaded lecture slides. No external hallucination.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
