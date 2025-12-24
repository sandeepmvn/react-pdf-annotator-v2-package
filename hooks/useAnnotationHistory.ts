
import { useState, useCallback } from 'react';
import { Annotations, Annotation } from '../types';

interface HistoryState {
  history: Annotations[];
  index: number;
}

export const useAnnotationHistory = () => {
  const [state, setState] = useState<HistoryState>({ history: [{}], index: 0 });

  const annotations = state.history[state.index] ?? {};

  const _updateHistoryWith = useCallback((getNewAnnotations: (current: Annotations) => Annotations) => {
    setState(prevState => {
      const currentAnnotations = prevState.history[prevState.index] ?? {};
      const newAnnotations = getNewAnnotations(currentAnnotations);
      
      if (JSON.stringify(currentAnnotations) === JSON.stringify(newAnnotations)) {
        return prevState;
      }
      
      const newHistory = prevState.history.slice(0, prevState.index + 1);
      newHistory.push(newAnnotations);
      
      return {
        history: newHistory,
        index: newHistory.length - 1,
      };
    });
  }, []);

  const addAnnotation = useCallback((page: number, annotationData: Omit<Annotation, 'id' | 'page'>) => {
    _updateHistoryWith(currentAnnotations => {
      const newAnnotations = JSON.parse(JSON.stringify(currentAnnotations));
      const newAnnotation: Annotation = {
        ...annotationData,
        page,
        id: `${Date.now()}-${Math.random()}`,
      } as Annotation;
      const pageAnnotations = newAnnotations[page] ? [...newAnnotations[page], newAnnotation] : [newAnnotation];
      newAnnotations[page] = pageAnnotations;
      return newAnnotations;
    });
  }, [_updateHistoryWith]);

  const deleteAnnotation = useCallback((page: number, annotationId: string) => {
    _updateHistoryWith(currentAnnotations => {
      const newAnnotations = JSON.parse(JSON.stringify(currentAnnotations));
      if (!newAnnotations[page]) return currentAnnotations;
      newAnnotations[page] = newAnnotations[page].filter((ann: Annotation) => ann.id !== annotationId);
      return newAnnotations;
    });
  }, [_updateHistoryWith]);

  const updateAnnotation = useCallback((updatedAnnotation: Annotation) => {
    _updateHistoryWith(currentAnnotations => {
      const newAnnotations = JSON.parse(JSON.stringify(currentAnnotations));
      const page = updatedAnnotation.page;
      if (!newAnnotations[page]) return currentAnnotations;

      const index = newAnnotations[page].findIndex((ann: Annotation) => ann.id === updatedAnnotation.id);
      if (index === -1) return currentAnnotations;

      newAnnotations[page][index] = updatedAnnotation;
      return newAnnotations;
    });
  }, [_updateHistoryWith]);
  
  const clearAnnotations = useCallback(() => {
    _updateHistoryWith(() => ({}));
  }, [_updateHistoryWith]);

  const setAnnotations = useCallback((newAnnotations: Annotations) => {
    setState({
      history: [newAnnotations],
      index: 0,
    });
  }, []);

  const undo = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      index: Math.max(0, prevState.index - 1),
    }));
  }, []);

  const redo = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      index: Math.min(prevState.history.length - 1, prevState.index + 1),
    }));
  }, []);

  const canUndo = state.index > 0;
  const canRedo = state.index < state.history.length - 1;

  return { 
    annotations, 
    addAnnotation, 
    deleteAnnotation,
    updateAnnotation,
    clearAnnotations,
    setAnnotations,
    undo, 
    redo, 
    canUndo, 
    canRedo 
  };
};
