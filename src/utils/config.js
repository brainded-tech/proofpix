// utils/config.js - Fixed version
import { APP_CONFIG } from '../config/app.config';
import { USAGE_LIMITS } from '../constants/limits';
import { UI_CONSTANTS } from '../constants/ui';
import { EXIF_CONSTANTS } from '../constants/exif';

export const getConfigValueFromAll = (path, defaultValue = null) => {
  const keys = path.split('.');
  let current = { APP_CONFIG, USAGE_LIMITS, UI_CONSTANTS, EXIF_CONSTANTS };
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current;
};

export const getLimit = (type, tier = 'daily') => {
  // Direct access to avoid circular imports
  const limits = USAGE_LIMITS[tier];
  return limits ? limits[type] || 0 : 0;
};

export const getUIConstant = (path) => {
  return getConfigValueFromAll(`UI_CONSTANTS.${path}`);
};