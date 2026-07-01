import { useState, useCallback } from 'react';

export type CLIQuestionType = 'options' | 'text' | 'multi-select';

export interface CLIOption {
  id: number | string;
  label: string;
}

export interface CLIQuestion {
  id: string;
  text: string;
  type: CLIQuestionType;
  options?: CLIOption[];
  placeholder?: string;
  defaultValue?: string | boolean;
  condition?: (answers: Record<string, any>) => boolean;
  starterPhrases?: string[];
  suggestions?: string[];
}

export interface FormCLIEngine {
  currentQuestion: CLIQuestion | null;
  submitAnswer: (answer: string | number | (string | number)[]) => void;
  goBack: () => void;
  canGoBack: boolean;
  isComplete: boolean;
  history: { questionId: string; answer: any }[];
  currentIndex: number;
  totalQuestions: number;
}

export function useFormCLI(
  questions: CLIQuestion[],
  onSectionComplete: (answers: Record<string, any>) => void
): FormCLIEngine {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<{ questionId: string; answer: any }[]>([]);

  const currentQuestion = currentIndex < questions.length ? questions[currentIndex] : null;
  const isComplete = currentIndex >= questions.length;

  // Find the next valid question index
  const getNextValidIndex = useCallback((startIndex: number, currentAnswers: Record<string, any>) => {
    let nextIndex = startIndex;
    while (nextIndex < questions.length) {
      const q = questions[nextIndex];
      if (!q.condition || q.condition(currentAnswers)) {
        return nextIndex;
      }
      nextIndex++;
    }
    return nextIndex; // Returns questions.length if all remaining are skipped
  }, [questions]);

  const submitAnswer = useCallback((answer: string | number | (string | number)[]) => {
    if (!currentQuestion) return;

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    setHistory(prev => [...prev, { questionId: currentQuestion.id, answer }]);

    const nextIndex = getNextValidIndex(currentIndex + 1, newAnswers);
    
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      // Completed all questions in this section
      onSectionComplete(newAnswers);
    }
  }, [currentQuestion, currentIndex, questions, answers, onSectionComplete, getNextValidIndex]);

  const goBack = useCallback(() => {
    if (history.length > 0) {
      // Pop the last history item
      const newHistory = [...history];
      const lastAction = newHistory.pop();
      setHistory(newHistory);
      
      // Find the index of the question we are going back to
      const previousIndex = questions.findIndex(q => q.id === lastAction?.questionId);
      if (previousIndex !== -1) {
        setCurrentIndex(previousIndex);
      }
    }
  }, [history, questions]);

  return {
    currentQuestion,
    submitAnswer,
    goBack,
    canGoBack: currentIndex > 0,
    isComplete,
    history,
    currentIndex,
    totalQuestions: questions.length
  };
}
