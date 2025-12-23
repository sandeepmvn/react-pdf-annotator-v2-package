
import React from 'react';

const iconProps = {
  className: "w-5 h-5",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor",
};

export const SelectIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25a8.25 8.25 0 00-8.25 8.25c0 1.913.64 3.705 1.75 5.25l.224.332.224-.332a8.25 8.25 0 005.252-10.5" /></svg>
);

export const PenIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
);

export const HighlighterIcon = () => (
  <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991 0l-2.07 2.07a8.25 8.25 0 01-11.667 0l-2.07-2.07m4.992 0l.043.043a8.25 8.25 0 0111.667 0l.043-.043m-11.75 0h11.75" /></svg>
);

export const FreeTextIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" /></svg>
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
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v7.5a2.25 2.25 0 002.25 2.25z" /></svg>
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
