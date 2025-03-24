/**
 * Utility functions for PWA (Progressive Web App) features
 */

/**
 * Checks if the current device is running iOS (iPhone, iPad, or iPod)
 * @returns boolean indicating if the device is iOS
 */
export const isIOS = (): boolean => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * Checks if the app is running in standalone mode (installed as PWA)
 * @returns boolean indicating if the app is in standalone mode
 */
export const isInStandaloneMode = (): boolean => {
  return (window.matchMedia('(display-mode: standalone)').matches) || 
         (window.navigator as any).standalone === true;
};

/**
 * Checks if the app should show the "Add to Home Screen" prompt
 * @returns boolean indicating if the prompt should be shown
 */
export const shouldShowInstallPrompt = (): boolean => {
  return isIOS() && !isInStandaloneMode();
};

/**
 * Gets the appropriate installation instructions based on the iOS version and browser
 * @returns Object containing title and steps for installation
 */
export const getIOSInstallInstructions = (): { title: string; steps: string[] } => {
  // Check if using Safari (most common browser on iOS)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isSafari) {
    return {
      title: 'Instalar como App',
      steps: [
        'Toca el ícono de compartir en la barra de navegación',
        'Desplázate hacia abajo y toca "Agregar a la pantalla de inicio"',
        'Toca "Agregar" en la esquina superior derecha'
      ]
    };
  } else {
    // Instructions for Chrome or other browsers on iOS
    return {
      title: 'Instalar como App',
      steps: [
        'Toca el ícono de menú (⋮) en la barra de navegación',
        'Toca "Agregar a la pantalla de inicio"',
        'Toca "Agregar" para confirmar'
      ]
    };
  }
};
