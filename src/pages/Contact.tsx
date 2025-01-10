// src/pages/Contact.tsx

import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Contactez-Nous</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <Input type="text" id="name" name="name" placeholder="Votre nom" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input type="email" id="email" name="email" placeholder="Votre email" required />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <Textarea id="message" name="message" placeholder="Votre message" rows={4} required />
          </div>
          <div>
            <Button type="submit" className="w-full" variant="default">
              Envoyer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Contact;
