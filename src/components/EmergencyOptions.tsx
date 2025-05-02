
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { EmergencyCategory, getEmergencyPhrasesByCategory } from '@/data/emergencyPhrases';

interface EmergencyOptionsProps {
  onSelectPhrase: (phraseId: string) => void;
}

const EmergencyOptions: React.FC<EmergencyOptionsProps> = ({ onSelectPhrase }) => {
  const categories: { value: EmergencyCategory | 'all', label: string, icon: string }[] = [
    { value: 'all', label: 'All', icon: '🆘' },
    { value: 'medical', label: 'Medical', icon: '🏥' },
    { value: 'police', label: 'Police', icon: '👮' },
    { value: 'fire', label: 'Fire', icon: '🔥' },
    { value: 'general', label: 'General', icon: '🔔' },
  ];

  return (
    <Card className="w-full p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Emergency Situation</h2>
      
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-5 w-full mb-6">
          {categories.map(category => (
            <TabsTrigger key={category.value} value={category.value} className="text-sm">
              <span className="mr-1">{category.icon}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category.value} value={category.value} className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getEmergencyPhrasesByCategory(category.value).map(phrase => (
                <button
                  key={phrase.id}
                  className="emergency-btn emergency-btn-blue"
                  onClick={() => onSelectPhrase(phrase.id)}
                >
                  <span className="text-3xl mb-2">{phrase.icon}</span>
                  <span className="text-sm text-center">{phrase.translations.en}</span>
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default EmergencyOptions;
