// Demo data is used ONLY as a fallback illustration when a search returns
// zero real results, and ONLY ever rendered with a clear "ಮಾದರಿ" / DEMO badge
// via components/listings — never merged into real result sets, and never
// given a working contact button (see DemoNotice / listing cards).
export const DEMO_WORKERS = [
  { id: 'demo-w1', full_name_kn: 'ಮಾದರಿ ಕೆಲಸಗಾರ ತಂಡ', full_name_en: 'Sample Worker Group', district: 'ಹಾಸನ', taluk: 'ಆಲೂರು', work_types: ['harvest'], workers_available: 6 },
  { id: 'demo-w2', full_name_kn: 'ಮಾದರಿ ನಾಟಿ ಕೆಲಸಗಾರರು', full_name_en: 'Sample Planting Workers', district: 'ಮಂಡ್ಯ', taluk: 'ಪಾಂಡವಪುರ', work_types: ['planting'], workers_available: 8 },
];

export const DEMO_MACHINERY = [
  { id: 'demo-m1', machine_type: 'tractor', machine_name_kn: 'ಮಾದರಿ ಟ್ರ್ಯಾಕ್ಟರ್', machine_name_en: 'Sample Tractor', district: 'ಹಾಸನ', taluk: 'ಹಾಸನ', price: 700, price_unit: 'hour' },
  { id: 'demo-m2', machine_type: 'harvester', machine_name_kn: 'ಮಾದರಿ ಹಾರ್ವೆಸ್ಟರ್', machine_name_en: 'Sample Harvester', district: 'ಮಂಡ್ಯ', taluk: 'ಶ್ರೀರಂಗಪಟ್ಟಣ', price: 1800, price_unit: 'acre' },
];
