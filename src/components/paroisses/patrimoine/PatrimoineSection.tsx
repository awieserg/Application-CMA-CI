
import React, { useState } from 'react';
import { PatrimoineForm } from './PatrimoineForm';
import { PatrimoineTable } from './PatrimoineTable';
import { PatrimoineSubmitData } from './types';

export function PatrimoineSection({ 
  paroisseId, 
  patrimoines, 
  addPatrimoine, 
  updatePatrimoine, 
  deletePatrimoine 
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (data: PatrimoineSubmitData) => {
    addPatrimoine.mutate(data);
  };

  return (
    <div className="space-y-8">
      <PatrimoineForm 
        paroisseId={paroisseId} 
        onSubmit={handleSubmit}
        onOpenChange={setIsFormOpen}
      />
      <PatrimoineTable 
        patrimoines={patrimoines || []}
        onUpdate={(patrimoine) => updatePatrimoine.mutate(patrimoine)}
        onDelete={(id) => deletePatrimoine.mutate(id)}
      />
    </div>
  );
}
