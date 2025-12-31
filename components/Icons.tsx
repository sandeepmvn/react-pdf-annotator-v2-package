
import React from 'react';

const iconProps = {
  className: "w-5 h-5",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor",
};

export const SelectIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="currentColor" /></svg>
);

export const PanIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" /></svg>
);

export const PenIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
);

export const HighlighterIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
);

export const FreeTextIcon = () => (
    <svg {...iconProps}><text x="12" y="17" fontSize="16" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">T</text></svg>
);

export const RectangleIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25-2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" /></svg>
);

export const CircleIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>
);

export const EraserIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655L7.797 12.04m3.615 3.615L15.655 11.412m-4.243 4.243L12 12m0 0L8.345 8.345m3.655 3.655L15.655 8.345m-7.31 7.31L12 12m-3.655-3.655L12 12m0 0l3.655 3.655m-3.655-3.655L8.345 8.345m-2.299 6.501a.75.75 0 01-1.06 0l-2.122-2.121a.75.75 0 010-1.061l3.182-3.182a.75.75 0 011.06 0l2.122 2.121a.75.75 0 010 1.061l-3.182 3.182zM18.97 5.03a.75.75 0 010 1.06l-2.121 2.122a.75.75 0 01-1.06 0l-2.122-2.122a.75.75 0 010-1.06l2.122-2.122a.75.75 0 011.06 0l2.121 2.122z" /></svg>
);

export const TrashIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09c-1.18 0-2.09.954-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);

export const ZoomInIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>
);

export const ZoomOutIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" /></svg>
);

export const DownloadIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
);

export const PrintIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.32 0c0-1.24-.98-2.25-2.21-2.25H8.552c-1.23 0-2.21 1.01-2.21 2.25m11.32 0-2.21 2.25m-8.9-2.25L7.45 15.456a1.125 1.125 0 011.591 0l.022.022a1.125 1.125 0 010 1.591l-1.18 1.18m0-1.18a9 9 0 009.536 2.343M3.75 21a3.375 3.375 0 01-3.375-3.375V10.312c0-.178.051-.35.146-.5l2.351-4.006a1.125 1.125 0 01.97-.566h12.556c.376 0 .723.158.97.43l2.351 4.006c.095.15.146.322.146.5v7.312a3.375 3.375 0 01-3.375 3.375H3.75z" /></svg>
);

export const UploadIcon = () => (
  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export const UnderlineIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m-6.75-3.75h13.5" /></svg>
);

export const StrikeoutIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m-6.75-7.5h13.5" /></svg>
);

export const SquigglyIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12c3-3 6 3 9 0s6 3 9 0" /></svg>
);

export const StampIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m-6 4h12m-6-8a2 2 0 100-4 2 2 0 000 4z" /><rect x="6" y="16" width="12" height="4" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 20h12" /></svg>
);

export const SignatureIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
);

export const InitialsIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
);

export const UndoIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
);

export const RedoIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" /></svg>
);

export const MoreIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
);
