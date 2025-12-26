# PDF Annotation Metadata Guide

## Overview

This PDF annotator automatically saves and loads annotations using PDF metadata. Annotations are embedded directly in the PDF file, so when you download an annotated PDF and upload it again, all annotations are preserved and editable.

## How It Works

### 1. **Saving Annotations to PDF Metadata**

When you download or print an annotated PDF:

```typescript
// Annotations are saved in the PDF's Subject metadata field
pdfDoc.setSubject('PDF_ANNOTATOR_DATA::' + JSON.stringify(historyState));
```

The system saves:
- All annotations across all pages
- Full undo/redo history (if size permits)
- Annotation properties (color, stroke width, position, etc.)

**Size Limits:**
- If metadata is less than 32KB: Full history is saved
- If metadata exceeds 32KB: Only current annotations are saved (history is discarded)

### 2. **Loading Annotations from PDF Metadata**

When you upload a PDF file that contains saved annotations:

```typescript
// System automatically checks the Subject field
const subject = pdfDoc.getSubject();
if (subject.startsWith('PDF_ANNOTATOR_DATA::')) {
  // Parse and load the annotations
  const historyState = JSON.parse(subject.substring(22));
  setHistoryState(historyState);
}
```

**Loading Priority:**
1. **Props first**: If `initialHistoryState` prop is provided, use it
2. **PDF metadata second**: If no props, check PDF metadata
3. **Empty state**: If neither exists, start with empty annotations

## Usage Examples

### Example 1: Basic Workflow

1. **Open a PDF** → Load a PDF file
2. **Add annotations** → Draw, highlight, add text, etc.
3. **Download** → Click "Download" button
4. **Reopen the downloaded PDF** → Upload the annotated PDF
5. **Edit annotations** → All annotations are loaded and editable!

### Example 2: Using with Props (External Storage)

```tsx
// Load annotations from your backend/localStorage
const savedData = await fetchAnnotationsFromBackend(pdfId);

<PdfViewer
  fileUrl={pdfUrl}
  initialHistoryState={savedData.historyState}
  onSave={(data) => saveToBackend(pdfId, data)}
/>
```

**Priority:** Props override PDF metadata

### Example 3: Metadata-Only Mode

```tsx
// Let PDF handle its own metadata
<PdfViewer
  fileUrl={pdfUrl}
  // No initialHistoryState prop
/>
```

When you download, annotations are saved in PDF.
When you reopen, annotations are loaded from PDF.

## Console Logs

The system provides helpful console logs:

**When Loading:**
- ✅ `"Loading PDF metadata - no props provided"` → Checking for metadata
- ✅ `"Loaded annotations from PDF metadata:"` → Success!
- ℹ️ `"No annotation metadata found in PDF"` → Clean PDF
- ℹ️ `"Skipping PDF metadata load - using props instead"` → Props provided

**When Saving:**
- ✅ `"Saved full annotation history to PDF metadata"` → Full save
- ⚠️ `"Saved simplified annotation data to PDF metadata (full history too large)"` → Partial save

## Testing the Metadata System

### Test 1: Save and Load from Metadata

1. Load the sample PDF
2. Add some annotations (pen, rectangle, text)
3. Click "Download" → saves as `sample-annotated.pdf`
4. Check console: Should see "Saved full annotation history to PDF metadata"
5. Upload the downloaded PDF
6. Check console: Should see "Loaded annotations from PDF metadata"
7. Verify: All annotations appear and are editable

### Test 2: Props vs Metadata Priority

1. Load a PDF with metadata (from Test 1)
2. Console shows: "Loaded annotations from PDF metadata"
3. Click "Get Data (Test)" to copy the metadata string
4. Click "Load from String" and paste
5. Console shows: "Skipping PDF metadata load - using props instead"
6. Verify: Props take priority

### Test 3: Large Annotation Sets

1. Add many annotations (>50)
2. Download the PDF
3. Check console:
   - If < 32KB: "Saved full annotation history"
   - If > 32KB: "Saved simplified annotation data"
4. Upload and verify annotations load correctly

## Troubleshooting

### Annotations Not Loading After Upload

**Check:**
1. Browser console for error messages
2. Is the PDF the one you just downloaded?
3. Did you accidentally set `initialHistoryState`?

**Solution:**
- Make sure `initialHistoryState` is `undefined` when uploading
- The code now automatically clears it on file upload

### Annotations Not Saving

**Check:**
1. Did you click "Download" or "Print"?
2. Check console for "Saved ... to PDF metadata"

**Solution:**
- Annotations only save when generating the annotated PDF
- Use the Download button to create the annotated file

### Can't Edit After Reload

**This is now fixed!** The component no longer remounts unnecessarily.

**If you still have issues:**
- Clear browser cache
- Check that you removed the `key={pdfFile}` prop
- Verify `hasPropsRef.current` logic

## Technical Details

### Metadata Storage Format

```json
{
  "history": [
    {
      "1": [/* page 1 annotations */],
      "2": [/* page 2 annotations */]
    }
  ],
  "index": 0
}
```

### Storage Location

- **Field:** PDF Subject metadata
- **Prefix:** `PDF_ANNOTATOR_DATA::`
- **Format:** JSON string
- **Max Size:** ~32KB (PDF specification limit)

### Compatibility

- ✅ Works with all PDF viewers (annotations are also rendered)
- ✅ Metadata is preserved when copying/emailing PDF
- ✅ Works offline (metadata is in the file itself)
- ⚠️ Some PDF editors may strip custom metadata

## Best Practices

1. **For permanent storage:** Use both metadata AND external storage (backend/localStorage)
2. **For sharing:** Metadata ensures recipients see annotations
3. **For large projects:** Use external storage to avoid size limits
4. **For simple use:** Metadata-only is perfect!

## API Reference

### Props

```typescript
interface PdfViewerProps {
  fileUrl: string;
  fileName: string;
  initialHistoryState?: HistoryState;  // Override metadata
  onSave?: (data: AnnotationExportData) => void;  // Callback on download
}
```

### Ref Methods

```typescript
const pdfViewerRef = useRef<PdfViewerRef>(null);

// Get annotation data programmatically
const data = pdfViewerRef.current?.getAnnotationData();

// Get annotated PDF blob
const blob = await pdfViewerRef.current?.getAnnotatedDocument();
```

---

**Note:** This system works seamlessly in the background. Users can simply:
1. Annotate → Download → Reopen → Edit

No configuration needed! 🎉
