import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";

export interface StepData {
  steps: number;
  isAvailable: boolean;
  error?: string;
}

export const useStepCounter = () => {
  const [stepData, setStepData] = useState<StepData>({
    steps: 0,
    isAvailable: false,
    error: undefined,
  });
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let subscription: any = null;

    const checkAvailability = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setStepData((prev) => ({ ...prev, isAvailable }));

        if (!isAvailable) {
          setStepData((prev) => ({
            ...prev,
            error: "Step counting is not available on this device",
          }));
        }
      } catch (error) {
        setStepData((prev) => ({
          ...prev,
          error: "Failed to check step counter availability",
        }));
      }
    };

    checkAvailability();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const startTracking = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        setStepData((prev) => ({
          ...prev,
          error: "Step counting is not available on this device",
        }));
        return;
      }

      setIsTracking(true);

      // Get today's steps
      const today = new Date();
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const result = await Pedometer.getStepCountAsync(start, today);
      setStepData((prev) => ({
        ...prev,
        steps: result.steps,
        error: undefined,
      }));
    } catch (error) {
      setStepData((prev) => ({
        ...prev,
        error: "Failed to get step count",
      }));
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const getTodaySteps = async (): Promise<number> => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        throw new Error("Step counting is not available on this device");
      }

      const today = new Date();
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const result = await Pedometer.getStepCountAsync(start, today);
      return result.steps;
    } catch (error) {
      console.error("Error getting today steps:", error);
      return 0;
    }
  };

  const getStepsForDate = async (date: Date): Promise<number> => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        throw new Error("Step counting is not available on this device");
      }

      const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000); // Next day

      const result = await Pedometer.getStepCountAsync(start, end);
      return result.steps;
    } catch (error) {
      console.error("Error getting steps for date:", error);
      return 0;
    }
  };

  return {
    stepData,
    isTracking,
    startTracking,
    stopTracking,
    getTodaySteps,
    getStepsForDate,
  };
};
