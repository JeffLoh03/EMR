import { useState, useCallback } from 'react';
import { DispenseRequest, DispenseQueue, Prescription } from '../types';

export const useArduinoSimulator = () => {
  const [dispenseHistory, setDispenseHistory] = useState<DispenseRequest[]>([]);
  const [dispenseQueue, setDispenseQueue] = useState<DispenseQueue[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingId, setCurrentProcessingId] = useState<string>();

  const addToQueue = useCallback((patientId: string, prescriptions: Prescription[]) => {
    const queueItem: DispenseQueue = {
      id: Date.now().toString(),
      patientId,
      patientName: prescriptions[0].patientName,
      prescriptions,
      status: 'Waiting',
      timestamp: new Date().toISOString(),
      currentPrescriptionIndex: 0
    };

    setDispenseQueue(prev => [...prev, queueItem]);
  }, []);

  const startDispensing = useCallback((queueItem: DispenseQueue) => {
    setIsProcessing(true);
    setCurrentProcessingId(queueItem.id);
    
    // Update queue item status
    setDispenseQueue(prev => prev.map(q => 
      q.id === queueItem.id ? { ...q, status: 'Processing' } : q
    ));

    // Process each prescription sequentially
    const processNextPrescription = (prescriptionIndex: number) => {
      if (prescriptionIndex >= queueItem.prescriptions.length) {
        // All prescriptions completed
        setDispenseQueue(prev => prev.map(q => 
          q.id === queueItem.id ? { ...q, status: 'Completed' } : q
        ));
        setIsProcessing(false);
        setCurrentProcessingId(undefined);
        return;
      }

      const prescription = queueItem.prescriptions[prescriptionIndex];
      
      // Update current prescription index
      setDispenseQueue(prev => prev.map(q => 
        q.id === queueItem.id ? { ...q, currentPrescriptionIndex: prescriptionIndex } : q
      ));

      // Create dispense request
      const dispenseRequest: DispenseRequest = {
        id: `${queueItem.id}-${prescriptionIndex}`,
        prescriptionId: prescription.id,
        patientId: prescription.patientId,
        patientName: prescription.patientName,
        medicationName: prescription.medicationName,
        dosage: prescription.dosage,
        boxNumber: prescription.boxNumber,
        timestamp: new Date().toISOString(),
        status: 'Pending'
      };
      setDispenseHistory(prev => [...prev, dispenseRequest]);

      // Simulate Arduino communication delay
      setTimeout(() => {
        setDispenseHistory(prev => prev.map(r => 
          r.id === dispenseRequest.id 
            ? { ...r, status: 'Dispensing', arduinoResponse: `Dispensing from Box ${r.boxNumber}...` }
            : r
        ));
      }, 1000);

      // Simulate completion
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        setDispenseHistory(prev => prev.map(r => 
          r.id === dispenseRequest.id 
            ? { 
                ...r, 
                status: success ? 'Completed' : 'Error',
                arduinoResponse: success 
                  ? `Successfully dispensed ${r.dosage} of ${r.medicationName} from Box ${r.boxNumber}`
                  : `Error: Box ${r.boxNumber} jam detected. Manual intervention required.`
              }
            : r
        ));

        if (success) {
          // Process next prescription after 1 second delay
          setTimeout(() => processNextPrescription(prescriptionIndex + 1), 1000);
        } else {
          // Stop processing on error
          setDispenseQueue(prev => prev.map(q => 
            q.id === queueItem.id ? { ...q, status: 'Error' } : q
          ));
          setIsProcessing(false);
          setCurrentProcessingId(undefined);
        }
      }, 3000);
    };

    // Start processing first prescription
    processNextPrescription(0);
  }, []);

  const pauseDispensing = useCallback(() => {
    setIsProcessing(false);
    setCurrentProcessingId(undefined);
    
    // Reset any processing queue items back to waiting
    setDispenseQueue(prev => prev.map(q => 
      q.status === 'Processing' ? { ...q, status: 'Waiting' } : q
    ));
  }, []);

  return { 
    dispenseHistory, 
    dispenseQueue, 
    isProcessing, 
    currentProcessingId,
    addToQueue, 
    startDispensing, 
    pauseDispensing 
  };
};