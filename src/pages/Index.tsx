import React, { useState } from 'react';
import { AlertCircle, BookOpen, Phone, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LanguageSelector from '@/components/LanguageSelector';
import EmergencyOptions from '@/components/EmergencyOptions';
import TranslationResult from '@/components/TranslationResult';
import LocationSharing from '@/components/LocationSharing';
import EmergencyReportDialog from '@/components/EmergencyReportDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [yourLanguage, setYourLanguage] = useState('en');
  const [localLanguage, setLocalLanguage] = useState('es');
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const emergencyNumbers = {
    general: {
      US: '911',
      EU: '112',
      UK: '999',
      AU: '000',
      JP: '110',
    }
  };

  const handleEmergencyCall = () => {
    window.location.href = `tel:${emergencyNumbers.general.EU}`;
  };

  const navButtons = (
    <>
      <Link to="/signup">
        <Button variant="outline" className="bg-white text-emergency-red border-white hover:bg-red-100">
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Button>
      </Link>
      <Link to="/login">
        <Button variant="outline" className="bg-white text-emergency-red border-white hover:bg-red-100">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </Link>
      <Button 
        variant="outline" 
        className="bg-white text-emergency-red border-white hover:bg-red-100"
        onClick={handleEmergencyCall}
      >
        <Phone className="mr-2 h-4 w-4" />
        Emergency Call
      </Button>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-emergency-red p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <AlertCircle className="mr-2" /> CrisisLingo
          </h1>
          
          {isMobile ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-red-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                  <div className="flex flex-col gap-2 p-2">
                    {navButtons}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              {navButtons}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6 flex justify-center">
          <EmergencyReportDialog />
        </div>

        <Alert className="mb-6 bg-emergency-red bg-opacity-10 border-emergency-red">
          <AlertCircle className="h-4 w-4 text-emergency-red" />
          <AlertTitle className="text-emergency-red">Emergency Translation Tool</AlertTitle>
          <AlertDescription>
            Select your language and the local language, then choose an emergency phrase to translate.
          </AlertDescription>
        </Alert>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Select Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LanguageSelector
                label="Your Language"
                value={yourLanguage}
                onChange={setYourLanguage}
              />
              <LanguageSelector
                label="Local Language"
                value={localLanguage}
                onChange={setLocalLanguage}
              />
            </div>

            {yourLanguage === localLanguage && (
              <p className="text-yellow-600 text-sm mt-2 text-center">
                Note: You've selected the same language for both options.
              </p>
            )}
          </CardContent>
        </Card>

        <EmergencyOptions onSelectPhrase={setSelectedPhraseId} />

        {selectedPhraseId && (
          <TranslationResult 
            phraseId={selectedPhraseId} 
            yourLanguage={yourLanguage} 
            localLanguage={localLanguage}
          />
        )}

        <LocationSharing />

        <Card className="mt-6 border border-slate-300 hover:shadow-lg transition">
          <a
            href="https://huggingface.co/spaces/smainye/Emergency-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
          <Button
            variant="default"
            className="w-full h-full p-0 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition"
          >
          <div className="flex flex-col items-start w-full text-left p-4">
            <CardHeader className="p-0 mb-2">
              <CardTitle>AI Assistance</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-slate-100">Start chatting with the AI assistant.</p>
            </CardContent>
          </div>
        </Button>
      </a>
      </Card>

        <Card className="mt-6 border-emergency-blue border-opacity-50">
          <CardContent className="pt-4">
            <div className="flex items-center mb-3">
              <BookOpen className="h-5 w-5 mr-2 text-emergency-blue" />
              <h3 className="font-medium">How to Use</h3>
            </div>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Select your language and the local language</li>
              <li>Choose an emergency situation or phrase</li>
              <li>Show the translated text to local people or emergency services</li>
              <li>Use the speaker icon to play audio of the phrase</li>
              <li>Share your location to help emergency services find you</li>
            </ol>

            <div className="mt-4 pt-4 border-t text-xs text-center text-gray-500">
              <p>In case of emergency, try to find someone who speaks your language or call local emergency services.</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-slate-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>Emergency numbers:</p>
          <div className="flex justify-center space-x-4 mt-1">
            <span>US: 911</span>
            <span>EU: 112</span>
            <span>UK: 999</span>
          </div>
          <Separator className="my-2 bg-slate-600" />
          <p className="text-xs opacity-70">
            RapidAid Language Bridge - Emergency Translation Tool
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
