interface UsageStats {
  uploads: number;
  pdfDownloads: number;
  imageDownloads: number;
  dataExports: number;
}

const STORAGE_KEY = 'proofpix_usage';
const DAILY_LIMITS = {
  uploads: 50,
  pdfDownloads: 10,
  imageDownloads: 25,
  dataExports: 15
};

export const getUsageData = (): UsageStats => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    return {
      uploads: 0,
      pdfDownloads: 0,
      imageDownloads: 0,
      dataExports: 0
    };
  }

  const data = JSON.parse(storedData);
  const lastReset = new Date(data.lastReset);
  const now = new Date();

  // Reset if it's a new day
  if (lastReset.getDate() !== now.getDate() || 
      lastReset.getMonth() !== now.getMonth() || 
      lastReset.getFullYear() !== now.getFullYear()) {
    const resetData = {
      uploads: 0,
      pdfDownloads: 0,
      imageDownloads: 0,
      dataExports: 0,
      lastReset: now.toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
    return resetData;
  }

  return data;
};

export const updateUsage = (type: keyof UsageStats): void => {
  const currentData = getUsageData();
  const now = new Date();

  const updatedData = {
    ...currentData,
    [type]: currentData[type] + 1,
    lastReset: now.toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
};

export const checkLimit = (type: keyof UsageStats): boolean => {
  const currentData = getUsageData();
  return currentData[type] < DAILY_LIMITS[type];
};

export const getRemainingUses = (type: keyof UsageStats): number => {
  const currentData = getUsageData();
  return Math.max(0, DAILY_LIMITS[type] - currentData[type]);
}; 