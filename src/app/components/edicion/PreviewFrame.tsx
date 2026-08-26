import React, { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

export type PreviewDevice = 'mobile' | 'desktop';

interface PreviewFrameProps {
  render: (device: PreviewDevice) => React.ReactNode;
}

const TABS: { id: PreviewDevice; label: string; Icon: typeof Monitor }[] = [
  { id: 'desktop', label: 'Computadora', Icon: Monitor },
  { id: 'mobile', label: 'Celular', Icon: Smartphone },
];

export function PreviewFrame({ render }: PreviewFrameProps) {
  const [device, setDevice] = useState<PreviewDevice>('desktop');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Cómo se va a ver
        </span>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setDevice(id)}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                device === id ? 'bg-white text-[#0c3c1f] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center rounded-xl bg-gray-900/5 p-3">
        <div
          className={
            device === 'mobile'
              ? 'w-full max-w-[280px] overflow-hidden rounded-lg bg-[#0c3c1f] shadow-md'
              : 'w-full overflow-hidden rounded-lg bg-[#0c3c1f] shadow-md'
          }
        >
          {render(device)}
        </div>
      </div>
    </div>
  );
}
