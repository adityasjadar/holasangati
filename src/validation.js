export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(String(phone).trim());
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

// Central place for the Kannada-first error/status strings required by the brief.
export const MESSAGES = {
  kn: {
    fillRequired: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಮಾಹಿತಿಯನ್ನು ತುಂಬಿ.',
    loginFailed: 'ಲಾಗಿನ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    checkInternet: 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ.',
    noResults: 'ಯಾವುದೇ ಸೇವೆ ಕಂಡುಬಂದಿಲ್ಲ.',
    requirementPosted: 'ನಿಮ್ಮ ಅವಶ್ಯಕತೆ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ.',
    invalidPhone: 'ಸರಿಯಾದ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ನಂಬರ್ ನಮೂದಿಸಿ.',
    passwordShort: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು.',
    phoneTaken: 'ಈ ಮೊಬೈಲ್ ನಂಬರ್ ಈಗಾಗಲೇ ನೋಂದಣಿಯಾಗಿದೆ.',
    genericError: 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    saved: 'ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.',
    deleted: 'ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ.',
  },
  en: {
    fillRequired: 'Please fill in all required information.',
    loginFailed: 'Could not log in. Please try again.',
    checkInternet: 'Please check your internet connection.',
    noResults: 'No services found.',
    requirementPosted: 'Your requirement has been posted successfully.',
    invalidPhone: 'Enter a valid 10-digit mobile number.',
    passwordShort: 'Password must be at least 6 characters.',
    phoneTaken: 'This mobile number is already registered.',
    genericError: 'Something went wrong. Please try again.',
    saved: 'Saved successfully.',
    deleted: 'Deleted successfully.',
  },
};
