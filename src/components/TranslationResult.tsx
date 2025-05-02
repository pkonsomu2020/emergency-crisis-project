
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Volume2, Copy, Share } from 'lucide-react';
import { translatePhrase, emergencyPhrases } from '@/data/emergencyPhrases';
import { getLanguageByCode } from '@/data/languages';
import { useToast } from '@/hooks/use-toast';

interface TranslationResultProps {
  phraseId: string | null;
  yourLanguage: string;
  localLanguage: string;
}

const TranslationResult: React.FC<TranslationResultProps> = ({ 
  phraseId, 
  yourLanguage, 
  localLanguage 
}) => {
  const { toast } = useToast();
  const synth = useRef(window.speechSynthesis);
  
  // Cancel any ongoing speech when component unmounts
  useEffect(() => {
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);
  
  if (!phraseId) {
    return null;
  }

  const phrase = emergencyPhrases.find(p => p.id === phraseId);
  if (!phrase) return null;

  const yourTranslation = translatePhrase(phrase, yourLanguage);
  const localTranslation = translatePhrase(phrase, localLanguage);
  
  const yourLanguageName = getLanguageByCode(yourLanguage).name;
  const localLanguageName = getLanguageByCode(localLanguage).name;

  const handleSpeak = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech first
      synth.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set the language correctly with BCP 47 language tag
      utterance.lang = language;
      
      // Handle potential errors
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        toast({
          title: "Speech error",
          description: `Could not play audio: ${event.error}`,
          variant: "destructive",
        });
      };
      
      // Confirm speech has started
      utterance.onstart = () => {
        console.log('Speech started');
      };
      
      // Attempt to speak
      synth.current.speak(utterance);
    } else {
      toast({
        title: "Speech synthesis not supported",
        description: "Your browser does not support text-to-speech functionality.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Translation copied successfully.",
      });
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Translation',
        text: `${yourTranslation}\n\n${localTranslation}`,
      }).catch(() => {
        toast({
          description: "Could not share the content",
          variant: "destructive",
        });
      });
    } else {
      toast({
        description: "Share functionality not supported on this browser",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full p-4 mt-4">
      <div className="text-center mb-4">
        <span className="text-4xl">{phrase.icon}</span>
      </div>
      
      {/* Your language */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium text-sm">{yourLanguageName} (You):</h3>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => handleSpeak(yourTranslation, yourLanguage)}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => handleCopy(yourTranslation)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Alert variant="default" className="bg-slate-50">
          <AlertDescription>{yourTranslation}</AlertDescription>
        </Alert>
      </div>
      
      {/* Local language */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium text-sm">{localLanguageName} (Local):</h3>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => handleSpeak(localTranslation, localLanguage)}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => handleCopy(localTranslation)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Alert variant="default" className="bg-emergency-red bg-opacity-10 border-emergency-red border-opacity-30">
          <AlertDescription className="text-lg font-medium">
            {localTranslation}
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="flex justify-center">
        <Button className="bg-emergency-blue" onClick={handleShare}>
          <Share className="mr-2 h-4 w-4" /> Share Translation
        </Button>
      </div>
    </Card>
  );
};

export default TranslationResult;
