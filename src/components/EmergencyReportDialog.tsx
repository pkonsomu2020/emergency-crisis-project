
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FormData = {
  type: string;
  description: string;
  location: string;
  contact_number: string;
};

export default function EmergencyReportDialog() {
  const { toast } = useToast();
  const form = useForm<FormData>();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      // First check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      const user_id = sessionData.session?.user?.id;

      // Get current location
      let latitude: number | null = null;
      let longitude: number | null = null;
      
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (error) {
        console.log('Location not available:', error);
        toast({
          title: "Location Access Failed",
          description: "Please enable location access for better emergency response.",
          variant: "destructive",
        });
      }

      const { error } = await supabase
        .from('emergency_reports')
        .insert([
          {
            ...data,
            user_id,
            latitude,
            longitude,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Emergency Report Submitted",
        description: "Your emergency has been reported. Help is on the way.",
      });

      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit emergency report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="lg"
          className="gap-2 text-lg font-bold py-6"
        >
          <AlertTriangle className="w-6 h-6" />
          Report Emergency
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Emergency</DialogTitle>
          <DialogDescription>
            Please provide details about your emergency situation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Medical, Fire, Security, etc." {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please describe your emergency situation..." 
                      {...field} 
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Details</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Street address, landmarks, or specific location details" 
                      {...field} 
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="Your contact number" 
                      {...field} 
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-4 mt-6">
              <Button type="submit" variant="destructive">
                Submit Emergency Report
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => window.location.href = `tel:+254745343256`}
                className="gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Emergency Services (+254 745 343256)
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
