import React from 'react';

interface PreviewScreenProps {
  onEnter: () => void;
  isExiting: boolean;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({ onEnter, isExiting }) => {
  // Box-drawing maze line art spelling URALREDUX in the exact style of the uploaded preview
  // U: ┬ ┬ / │ │ / │ │ / └─┘
  // R: ┌─┐ / ├─┘ / ├─┐ / ┴ └
  // A: ┌─┐ / │ │ / ├─┤ / ┴ ┴
  // L: ┬   / │   / │   / └──
  // R: ┌─┐ / ├─┘ / ├─┐ / ┴ └
  // E: ┌─┐ / ├─  / ├─  / └──
  // D: ┌─┐ / │ │ / │ │ / └─┘
  // U: ┬ ┬ / │ │ / │ │ / └─┘
  // X: ┬ ┬ / └┬┘ / ┌┴┐ / ┴ ┴
  const lineArtRows = [
    '┬ ┬┌─┐┌─┐┬  ┌─┐┌─┐┌─┐┬ ┬┬ ┬',
    '│ │├─┘│ ││  ├─┘├─ │ ││ │└┬┘',
    '│ │├─┐├─┤│  ├─┐├─ │ ││ │┌┴┐',
    '└─┘┴ └┴ ┴└──┴ └└──└─┘└─┘┴ ┴',
  ];

  return (
    <div
      onClick={onEnter}
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-700 ease-out backdrop-blur-md bg-black/45 ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center text-center group px-4 py-8">
        {/* "Click" */}
        <span className="font-display font-medium text-sm md:text-base text-white tracking-wide transition-transform duration-300 group-hover:scale-105 mb-4">
          Click
        </span>

        {/* Geometric Line-Art block for "URALREDUX" (полоски из превью) */}
        <div className="flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <div className="font-boxlines text-white text-base sm:text-xl md:text-2xl font-normal leading-[1.05] tracking-[0.08em] whitespace-pre inline-block text-center">
            {lineArtRows.map((row, idx) => (
              <div key={idx} className="leading-tight py-[0.5px]">
                {row}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
