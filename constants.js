export const DISTRICTS = [
  'ಬಾಗಲಕೋಟೆ', 'ಬಳ್ಳಾರಿ', 'ಬೆಳಗಾವಿ', 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ', 'ಬೆಂಗಳೂರು ನಗರ',
  'ಬೀದರ್', 'ಚಾಮರಾಜನಗರ', 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ', 'ಚಿಕ್ಕಮಗಳೂರು', 'ಚಿತ್ರದುರ್ಗ',
  'ದಕ್ಷಿಣ ಕನ್ನಡ', 'ದಾವಣಗೆರೆ', 'ಧಾರವಾಡ', 'ಗದಗ', 'ಹಾಸನ', 'ಹಾವೇರಿ',
  'ಕಲಬುರಗಿ', 'ಕೊಡಗು', 'ಕೋಲಾರ', 'ಕೊಪ್ಪಳ', 'ಮಂಡ್ಯ', 'ಮೈಸೂರು', 'ರಾಯಚೂರು',
  'ರಾಮನಗರ', 'ಶಿವಮೊಗ್ಗ', 'ತುಮಕೂರು', 'ಉಡುಪಿ', 'ಉತ್ತರ ಕನ್ನಡ', 'ವಿಜಯಪುರ',
  'ಯಾದಗಿರಿ', 'ವಿಜಯನಗರ',
];

// Work types: value is the stable DB key, kn/en are display labels.
export const WORK_TYPES = [
  { value: 'harvest', kn: 'ಕೊಯ್ಲು', en: 'Harvesting' },
  { value: 'planting', kn: 'ನಾಟಿ', en: 'Planting' },
  { value: 'weeding', kn: 'ಕಳೆ ತೆಗೆಯುವುದು', en: 'Weeding' },
  { value: 'spraying', kn: 'ಸಿಂಪಡಣೆ', en: 'Spraying' },
  { value: 'general', kn: 'ಸಾಮಾನ್ಯ ಕೃಷಿ ಕೆಲಸ', en: 'General farm work' },
  { value: 'other', kn: 'ಇತರೆ', en: 'Other' },
];

export const MACHINE_TYPES = [
  { value: 'tractor', kn: 'ಟ್ರ್ಯಾಕ್ಟರ್', en: 'Tractor', icon: '🚜' },
  { value: 'rotavator', kn: 'ರೋಟವೇಟರ್', en: 'Rotavator', icon: '🔄' },
  { value: 'cultivator', kn: 'ಕಲ್ಟಿವೇಟರ್', en: 'Cultivator', icon: '🌱' },
  { value: 'harvester', kn: 'ಹಾರ್ವೆಸ್ಟರ್', en: 'Harvester', icon: '🌾' },
  { value: 'seed_drill', kn: 'ಬಿತ್ತನೆ ಯಂತ್ರ', en: 'Seed Drill', icon: '🌱' },
  { value: 'sprayer', kn: 'ಸಿಂಪಡಣೆ ಯಂತ್ರ', en: 'Sprayer', icon: '💦' },
  { value: 'tiller', kn: 'ಟಿಲ್ಲರ್', en: 'Tiller', icon: '🚜' },
  { value: 'other', kn: 'ಇತರೆ', en: 'Other', icon: '⚙️' },
];

export const PRICE_UNITS = [
  { value: 'hour', kn: '₹ / ಗಂಟೆ', en: '₹ / hour' },
  { value: 'acre', kn: '₹ / ಎಕರೆ', en: '₹ / acre' },
  { value: 'day', kn: '₹ / ದಿನ', en: '₹ / day' },
];

export const REQUIREMENT_TYPES = [
  { value: 'workers', kn: 'ಕೆಲಸಗಾರರು', en: 'Workers', icon: '🌾' },
  { value: 'tractor', kn: 'ಟ್ರ್ಯಾಕ್ಟರ್', en: 'Tractor', icon: '🚜' },
  { value: 'harvester', kn: 'ಹಾರ್ವೆಸ್ಟರ್', en: 'Harvester', icon: '🌾' },
  { value: 'other_machine', kn: 'ಇತರೆ ಯಂತ್ರ', en: 'Other machinery', icon: '⚙️' },
];

export const REPORT_REASONS = [
  { value: 'fake_profile', kn: 'ನಕಲಿ ಪ್ರೊಫೈಲ್', en: 'Fake profile' },
  { value: 'wrong_info', kn: 'ತಪ್ಪು ಮಾಹಿತಿ', en: 'Wrong information' },
  { value: 'bad_behavior', kn: 'ಕೆಟ್ಟ ವರ್ತನೆ', en: 'Bad behavior' },
  { value: 'suspicious', kn: 'ಅನುಮಾನಾಸ್ಪದ ಚಟುವಟಿಕೆ', en: 'Suspicious activity' },
  { value: 'other', kn: 'ಇತರೆ', en: 'Other' },
];

export const ROLES = [
  { value: 'farmer', kn: 'ರೈತ', en: 'Farmer', icon: '👨‍🌾' },
  { value: 'worker', kn: 'ಕೃಷಿ ಕೆಲಸಗಾರ', en: 'Agricultural Worker', icon: '🌾' },
  { value: 'owner', kn: 'ಯಂತ್ರ ಮಾಲೀಕ', en: 'Machinery Owner', icon: '🚜' },
];

export function labelFor(list, value, lang) {
  const item = list.find((i) => i.value === value);
  if (!item) return value;
  return lang === 'kn' ? item.kn : item.en;
}
