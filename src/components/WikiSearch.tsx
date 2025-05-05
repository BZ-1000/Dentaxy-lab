import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Copy, Loader2, CheckCircle2, Search, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from '@/hooks/use-theme';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useDebounce } from '@/hooks/use-debounce';

interface WikiResult {
  pageid: number;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  terms?: {
    description: string[];
  };
}

const WikiSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<WikiResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<WikiResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [customText, setCustomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [generatedCustomText, setGeneratedCustomText] = useState('');
  const [isCustomCopied, setIsCustomCopied] = useState(false);
  const [isAccordionExpanded, setIsAccordionExpanded] useState(false);
  const [isAccordionCustomExpanded, setIsAccordionCustomExpanded] = useState(false);
  const [isAccordionGeneratingExpanded, setIsAccordionGeneratingExpanded] = useState(false);
  const [isAccordionGeneratingCustomExpanded, setIsAccordionGeneratingCustomExpanded] = useState(false);
  const [isAccordionCopiedExpanded, setIsAccordionCopiedExpanded] = useState(false);
  const [isAccordionCustomCopiedExpanded, setIsAccordionCustomCopiedExpanded] = useState(false);
  const [isAccordionErrorExpanded, setIsAccordionErrorExpanded] = useState(false);
  const [isAccordionLoadingExpanded, setIsAccordionLoadingExpanded] = useState(false);
  const [isAccordionSelectedExpanded, setIsAccordionSelectedExpanded] = useState(false);
  const [isAccordionSearchExpanded, setIsAccordionSearchExpanded] = useState(false);
  const [isAccordionResultsExpanded, setIsAccordionResultsExpanded] = useState(false);
  const [isAccordionCustomTextExpanded, setIsAccordionCustomTextExpanded] = useState(false);
  const [isAccordionGeneratedTextExpanded, setIsAccordionGeneratedTextExpanded] = useState(false);
  const [isAccordionGeneratedCustomTextExpanded, setIsAccordionGeneratedCustomTextExpanded] = useState(false);
  const [isAccordionCopiedTextExpanded, setIsAccordionCopiedTextExpanded] = useState(false);
  const [isAccordionCustomCopiedTextExpanded, setIsAccordionCustomCopiedTextExpanded] = useState(false);
  const [isAccordionNoResultsExpanded, setIsAccordionNoResultsExpanded] = useState(false);
  const [isAccordionNoSelectedExpanded, setIsAccordionNoSelectedExpanded] = useState(false);
  const [isAccordionNoCustomTextExpanded, setIsAccordionNoCustomTextExpanded] = useState(false);
  const [isAccordionNoGeneratedTextExpanded, setIsAccordionNoGeneratedTextExpanded] = useState(false);
  const [isAccordionNoGeneratedCustomTextExpanded, setIsAccordionNoGeneratedCustomTextExpanded] = useState(false);
  const [isAccordionNoCopiedTextExpanded, setIsAccordionNoCopiedTextExpanded] = useState(false);
  const [isAccordionNoCustomCopiedTextExpanded, setIsAccordionNoCustomCopiedTextExpanded] = useState(false);
  const [isAccordionNoErrorExpanded, setIsAccordionNoErrorExpanded] = useState(false);
  const [isAccordionNoLoadingExpanded, setIsAccordionNoLoadingExpanded] = useState(false);
  const [isAccordionNoSearchExpanded, setIsAccordionNoSearchExpanded] = useState(false);
  const [isAccordionNoResultsTextExpanded, setIsAccordionNoResultsTextExpanded] = useState(false);
  const [isAccordionNoCustomTextTextExpanded, setIsAccordionNoCustomTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedTextTextExpanded, setIsAccordionNoGeneratedTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedCustomTextTextExpanded, setIsAccordionNoGeneratedCustomTextTextExpanded] = useState(false);
  const [isAccordionNoCopiedTextTextExpanded, setIsAccordionNoCopiedTextTextExpanded] = useState(false);
  const [isAccordionNoCustomCopiedTextTextExpanded, setIsAccordionNoCustomCopiedTextTextExpanded] = useState(false);
  const [isAccordionNoErrorTextExpanded, setIsAccordionErrorTextExpanded] = useState(false);
  const [isAccordionNoLoadingTextExpanded, setIsAccordionLoadingTextExpanded] = useState(false);
  const [isAccordionNoSearchTextExpanded, setIsAccordionSearchTextExpanded] = useState(false);
  const [isAccordionNoSelectedTextExpanded, setIsAccordionSelectedTextExpanded] = useState(false);
  const [isAccordionNoResultsTextTextExpanded, setIsAccordionNoResultsTextTextExpanded] = useState(false);
  const [isAccordionNoCustomTextTextTextExpanded, setIsAccordionNoCustomTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedTextTextTextExpanded, setIsAccordionNoGeneratedTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedCustomTextTextTextExpanded, setIsAccordionNoGeneratedCustomTextTextTextExpanded] = useState(false);
  const [isAccordionNoCopiedTextTextTextExpanded, setIsAccordionNoCopiedTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomCopiedTextTextTextExpanded, setIsAccordionNoCustomCopiedTextTextTextExpanded] = useState(false);
  const [isAccordionNoErrorTextTextTextExpanded, setIsAccordionErrorTextTextTextExpanded] = useState(false);
  const [isAccordionNoLoadingTextTextTextExpanded, setIsAccordionLoadingTextTextTextExpanded] = useState(false);
  const [isAccordionNoSearchTextTextTextExpanded, setIsAccordionSearchTextTextTextExpanded] = useState(false);
  const [isAccordionNoSelectedTextTextTextExpanded, setIsAccordionSelectedTextTextTextExpanded] = useState(false);
  const [isAccordionNoResultsTextTextTextExpanded, setIsAccordionResultsTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomTextTextTextTextExpanded, setIsAccordionCustomTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedTextTextTextTextExpanded, setIsAccordionGeneratedTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedCustomTextTextTextTextExpanded, setIsAccordionGeneratedCustomTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCopiedTextTextTextTextExpanded, setIsAccordionCopiedTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomCopiedTextTextTextTextExpanded, setIsAccordionCustomCopiedTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoErrorTextTextTextTextExpanded, setIsAccordionErrorTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoLoadingTextTextTextTextExpanded, setIsAccordionLoadingTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSearchTextTextTextTextExpanded, setIsAccordionSearchTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSelectedTextTextTextTextExpanded, setIsAccordionSelectedTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoResultsTextTextTextTextExpanded, setIsAccordionResultsTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomTextTextTextTextTextExpanded, setIsAccordionCustomTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedTextTextTextTextTextExpanded, setIsAccordionGeneratedTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedCustomTextTextTextTextTextExpanded, setIsAccordionGeneratedCustomTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCopiedTextTextTextTextTextExpanded, setIsAccordionCopiedTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomCopiedTextTextTextTextTextExpanded, setIsAccordionCustomCopiedTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoErrorTextTextTextTextTextExpanded, setIsAccordionErrorTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoLoadingTextTextTextTextTextExpanded, setIsAccordionLoadingTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSearchTextTextTextTextTextExpanded, setIsAccordionSearchTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSelectedTextTextTextTextTextExpanded, setIsAccordionSelectedTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoResultsTextTextTextTextTextExpanded, setIsAccordionResultsTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomTextTextTextTextTextTextExpanded, setIsAccordionCustomTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedTextTextTextTextTextTextExpanded, setIsAccordionGeneratedTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedCustomTextTextTextTextTextTextExpanded, setIsAccordionGeneratedCustomTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCopiedTextTextTextTextTextTextExpanded, setIsAccordionCopiedTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomCopiedTextTextTextTextTextTextExpanded, setIsAccordionCustomCopiedTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoErrorTextTextTextTextTextTextExpanded, setIsAccordionErrorTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoLoadingTextTextTextTextTextTextExpanded, setIsAccordionLoadingTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSearchTextTextTextTextTextTextExpanded, setIsAccordionSearchTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSelectedTextTextTextTextTextTextExpanded, setIsAccordionSelectedTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoResultsTextTextTextTextTextTextExpanded, setIsAccordionResultsTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomTextTextTextTextTextTextTextExpanded, setIsAccordionCustomTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedTextTextTextTextTextTextTextExpanded, setIsAccordionGeneratedTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedCustomTextTextTextTextTextTextTextExpanded, setIsAccordionGeneratedCustomTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCopiedTextTextTextTextTextTextTextExpanded, setIsAccordionCopiedTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomCopiedTextTextTextTextTextTextTextExpanded, setIsAccordionCustomCopiedTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoErrorTextTextTextTextTextTextTextExpanded, setIsAccordionErrorTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoLoadingTextTextTextTextTextTextTextExpanded, setIsAccordionLoadingTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSearchTextTextTextTextTextTextTextExpanded, setIsAccordionSearchTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSelectedTextTextTextTextTextTextTextExpanded, setIsAccordionSelectedTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoResultsTextTextTextTextTextTextTextExpanded, setIsAccordionResultsTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomTextTextTextTextTextTextTextTextExpanded, setIsAccordionCustomTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedTextTextTextTextTextTextTextTextExpanded, setIsAccordionGeneratedTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedCustomTextTextTextTextTextTextTextTextExpanded, setIsAccordionGeneratedCustomTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCopiedTextTextTextTextTextTextTextTextExpanded, setIsAccordionCopiedTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomCopiedTextTextTextTextTextTextTextTextExpanded, setIsAccordionCustomCopiedTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoErrorTextTextTextTextTextTextTextTextExpanded, setIsAccordionErrorTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoLoadingTextTextTextTextTextTextTextTextExpanded, setIsAccordionLoadingTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSearchTextTextTextTextTextTextTextTextExpanded, setIsAccordionSearchTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSelectedTextTextTextTextTextTextTextTextExpanded, setIsAccordionSelectedTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoResultsTextTextTextTextTextTextTextTextExpanded, setIsAccordionResultsTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomTextTextTextTextTextTextTextTextTextExpanded, setIsAccordionCustomTextTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedTextTextTextTextTextTextTextTextTextExpanded, setIsAccordionGeneratedTextTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoGeneratedCustomTextTextTextTextTextTextTextTextTextExpanded, setIsAccordionGeneratedCustomTextTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCopiedTextTextTextTextTextTextTextTextTextExpanded, setIsAccordionCopiedTextTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoCustomCopiedTextTextTextTextTextTextTextTextTextExpanded, setIsAccordionCustomCopiedTextTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoErrorTextTextTextTextTextTextTextTextTextExpanded, setIsAccordionErrorTextTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoLoadingTextTextTextTextTextTextTextTextTextExpanded, setIsAccordionLoadingTextTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSearchTextTextTextTextTextTextTextTextTextExpanded, setIsAccordionSearchTextTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoSelectedTextTextTextTextTextTextTextTextTextExpanded, setIsAccordionSelectedTextTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [isAccordionNoResultsTextTextTextTextTextTextTextTextTextExpanded, setIsAccordionResultsTextTextTextTextTextTextTextTextTextExpanded] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce(searchTerm, 500);
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const customTextInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm);
    } else {
      setResults([]);
      setError(null);
    }
  }, [debouncedSearchTerm]);

  const handleSearch = useCallback(async (term: string) => {
    if (!term) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${term}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.query.search.length === 0) {
        setResults([]);
        setError('No results found.');
        return;
      }

      const searchResults = data.query.search;

      const extractPromises = searchResults.map(async (result: any) => {
        const extractEndpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|terms&piprop=thumbnail&pithumbsize=200&titles=${result.title}&format=json&origin=*&exintro=1&explaintext=1`;
        const extractResponse = await fetch(extractEndpoint);
        const extractData = await extractResponse.json();
        const pageId = Object.keys(extractData.query.pages)[0];
        const page = extractData.query.pages[pageId];

        return {
          pageid: result.pageid,
          title: result.title,
          extract: page.extract || 'No extract available',
          thumbnail: page.thumbnail,
          terms: page.terms,
        };
      });

      const resultsWithExtracts = await Promise.all(extractPromises);
      setResults(resultsWithExtracts);
      setError(null);
    } catch (err: any) {
      setError(`Search failed: ${err.message}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResultClick = (result: WikiResult) => {
    setSelectedResult(result);
    setIsExpanded(true);
  };

  const handleCopyClick = () => {
    if (selectedResult) {
      navigator.clipboard.writeText(selectedResult.extract)
        .then(() => {
          setCopied(true);
          toast({
            title: "Copied to clipboard!",
            description: "The extract has been successfully copied.",
          })
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
          toast({
            variant: "destructive",
            title: "Copy failed",
            description: "Failed to copy the extract to clipboard.",
          })
        });
    }
  };

  const handleGenerateText = async () => {
    if (!selectedResult) {
      toast({
        variant: "destructive",
        title: "No Result Selected",
        description: "Please select a result to generate text.",
      })
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: selectedResult.extract }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedText(data.generatedText);
      toast({
        title: "Text Generated!",
        description: "The text has been successfully generated.",
      })
    } catch (error: any) {
      console.error("AI Text generation failed: ", error);
      toast({
        variant: "destructive",
        title: "Text generation failed",
        description: "Failed to generate the text.",
      })
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyGeneratedText = () => {
    navigator.clipboard.writeText(generatedText)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Copied to clipboard!",
          description: "The generated text has been successfully copied.",
        })
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error("Failed to copy generated text: ", err);
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Failed to copy the generated text to clipboard.",
        })
      });
  };

  const handleGenerateCustomText = async () => {
    if (!customText) {
      toast({
        variant: "destructive",
        title: "No Custom Text",
        description: "Please enter custom text to generate text.",
      })
      return;
    }

    setIsGeneratingCustom(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: customText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedCustomText(data.generatedText);
      toast({
        title: "Custom Text Generated!",
        description: "The custom text has been successfully generated.",
      })
    } catch (error: any) {
      console.error("AI Custom Text generation failed: ", error);
      toast({
        variant: "destructive",
        title: "Custom Text generation failed",
        description: "Failed to generate the custom text.",
      })
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const handleCopyGeneratedCustomText = () => {
    navigator.clipboard.writeText(generatedCustomText)
      .then(() => {
        setIsCustomCopied(true);
        toast({
          title: "Copied to clipboard!",
          description: "The generated custom text has been successfully copied.",
        })
        setTimeout(() => {
          setIsCustomCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error("Failed to copy generated custom text: ", err);
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Failed to copy the generated custom text to clipboard.",
        })
      });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearCustomText = () => {
    setCustomText('');
    if (customTextInputRef.current) {
      customTextInputRef.current.focus();
    }
  };

  const expandText = function() {
    const element = document.getElementById("expandableText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };
  
  const expandTextCustom = function() {
    const element = document.getElementById("expandableTextCustom");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextGenerated = function() {
    const element = document.getElementById("expandableTextGenerated");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextGeneratedCustom = function() {
    const element = document.getElementById("expandableTextGeneratedCustom");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextCopied = function() {
    const element = document.getElementById("expandableTextCopied");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextCustomCopied = function() {
    const element = document.getElementById("expandableTextCustomCopied");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextError = function() {
    const element = document.getElementById("expandableTextError");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextLoading = function() {
    const element = document.getElementById("expandableTextLoading");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextSearch = function() {
    const element = document.getElementById("expandableTextSearch");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextResults = function() {
    const element = document.getElementById("expandableTextResults");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextCustomText = function() {
    const element = document.getElementById("expandableTextCustomText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextGeneratedText = function() {
    const element = document.getElementById("expandableTextGeneratedText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextGeneratedCustomText = function() {
    const element = document.getElementById("expandableTextGeneratedCustomText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextCopiedText = function() {
    const element = document.getElementById("expandableTextCopiedText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextCustomCopiedText = function() {
    const element = document.getElementById("expandableTextCustomCopiedText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoResults = function() {
    const element = document.getElementById("expandableTextNoResults");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoSelected = function() {
    const element = document.getElementById("expandableTextNoSelected");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCustomText = function() {
    const element = document.getElementById("expandableTextNoCustomText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoGeneratedText = function() {
    const element = document.getElementById("expandableTextNoGeneratedText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoGeneratedCustomText = function() {
    const element = document.getElementById("expandableTextNoGeneratedCustomText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCopiedText = function() {
    const element = document.getElementById("expandableTextNoCopiedText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCustomCopiedText = function() {
    const element = document.getElementById("expandableTextNoCustomCopiedText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoError = function() {
    const element = document.getElementById("expandableTextNoError");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoLoading = function() {
    const element = document.getElementById("expandableTextNoLoading");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoSearch = function() {
    const element = document.getElementById("expandableTextNoSearch");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoResultsText = function() {
    const element = document.getElementById("expandableTextNoResultsText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCustomTextText = function() {
    const element = document.getElementById("expandableTextNoCustomTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoGeneratedTextText = function() {
    const element = document.getElementById("expandableTextNoGeneratedTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoGeneratedCustomTextText = function() {
    const element = document.getElementById("expandableTextNoGeneratedCustomTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCopiedTextText = function() {
    const element = document.getElementById("expandableTextNoCopiedTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCustomCopiedTextText = function() {
    const element = document.getElementById("expandableTextNoCustomCopiedTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoErrorText = function() {
    const element = document.getElementById("expandableTextNoErrorText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoLoadingText = function() {
    const element = document.getElementById("expandableTextNoLoadingText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoSearchText = function() {
    const element = document.getElementById("expandableTextNoSearchText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoSelectedText = function() {
    const element = document.getElementById("expandableTextNoSelectedText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoResultsTextText = function() {
    const element = document.getElementById("expandableTextNoResultsTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCustomTextTextText = function() {
    const element = document.getElementById("expandableTextNoCustomTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoGeneratedTextTextText = function() {
    const element = document.getElementById("expandableTextNoGeneratedTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoGeneratedCustomTextTextText = function() {
    const element = document.getElementById("expandableTextNoGeneratedCustomTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCopiedTextTextText = function() {
    const element = document.getElementById("expandableTextNoCopiedTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCustomCopiedTextTextText = function() {
    const element = document.getElementById("expandableTextNoCustomCopiedTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoErrorTextText = function() {
    const element = document.getElementById("expandableTextNoErrorTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoLoadingTextText = function() {
    const element = document.getElementById("expandableTextNoLoadingTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoSearchTextText = function() {
    const element = document.getElementById("expandableTextNoSearchTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoSelectedTextText = function() {
    const element = document.getElementById("expandableTextNoSelectedTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoResultsTextTextText = function() {
    const element = document.getElementById("expandableTextNoResultsTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCustomTextTextTextText = function() {
    const element = document.getElementById("expandableTextNoCustomTextTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoGeneratedTextTextTextText = function() {
    const element = document.getElementById("expandableTextNoGeneratedTextTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoGeneratedCustomTextTextTextText = function() {
    const element = document.getElementById("expandableTextNoGeneratedCustomTextTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCopiedTextTextTextText = function() {
    const element = document.getElementById("expandableTextNoCopiedTextTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoCustomCopiedTextTextTextText = function() {
    const element = document.getElementById("expandableTextNoCustomCopiedTextTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoErrorTextTextText = function() {
    const element = document.getElementById("expandableTextNoErrorTextTextText");
    if (element) {
      element.classList.toggle("expanded");
    }
  };

  const expandTextNoLoadingTextTextText
