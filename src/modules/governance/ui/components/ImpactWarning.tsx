import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import type { TokenEntity } from '../../../../core/types';

export interface ImpactReport {
    totalAffected: number;
    breakdown: Record<string, number>;
    tokens: TokenEntity[];
    severity: 'low' | 'medium' | 'high';
}

export function ImpactWarning({ report, onDismiss }: { report: ImpactReport | null, onDismiss: () => void }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (report) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onDismiss, 300); // Wait for fade out
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [report, onDismiss]);

    if (!report && !visible) return null;

    const severityStyles = {
        low: 'bg-slate-800 border-blue-500/50 shadow-blue-500/20',
        medium: 'bg-slate-800 border-yellow-500/50 shadow-yellow-500/20',
        high: 'bg-slate-900 border-red-500 shadow-red-500/30 ring-1 ring-red-500/50'
    };

    const severityIcon = {
        low: 'ℹ️',
        medium: '⚠️',
        high: '🚨'
    };

    return (
        <div className={clsx(
            "fixed bottom-8 right-8 z-50 transition-all duration-300 transform",
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        )}>
            <div className={clsx(
                "bg-slate-900 border backdrop-blur-md rounded-lg p-4 shadow-xl max-w-sm w-full",
                report ? severityStyles[report.severity] : ""
            )}>
                <div className="flex items-start gap-3">
                    <div className="text-2xl">{report ? severityIcon[report.severity] : ''}</div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-100 text-sm">
                            Impact Analysis
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Modifying this token will affect <strong className="text-slate-200">{report?.totalAffected} elements</strong>.
                        </p>
                        {report?.breakdown && (
                            <ul className="mt-2 space-y-1">
                                {Object.entries(report.breakdown).map(([type, count]) => (
                                    <li key={type} className="text-[10px] text-slate-500 flex justify-between uppercase tracking-wider">
                                        <span>{type}</span>
                                        <span className="font-mono text-slate-300">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button
                        onClick={() => setVisible(false)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}
