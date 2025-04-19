import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir los tipos de temas disponibles
export type ThemeType = 'green' | 'turquoise' | 'dark' | 'orange' | 'brick';

// Definir la interfaz del contexto
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

// Crear el contexto con un valor predeterminado
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

// Props para el proveedor
interface ThemeProviderProps {
  children: ReactNode;
}

// Componente proveedor
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Intentar obtener el tema guardado en localStorage, o usar 'green' como predeterminado
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return (savedTheme as ThemeType) || 'green';
  });

  // Cargar el tema predeterminado desde manifest.json si no hay tema guardado en localStorage
  useEffect(() => {
    // Solo cargar desde manifest.json si no hay tema guardado en localStorage
    if (!localStorage.getItem('appTheme')) {
      fetch('/manifest.json')
        .then(response => response.json())
        .then(manifest => {
          if (manifest.default_theme && ['green', 'turquoise', 'dark', 'orange', 'brick'].includes(manifest.default_theme)) {
            const themeFromManifest = manifest.default_theme as ThemeType;
            setThemeState(themeFromManifest);
            localStorage.setItem('appTheme', themeFromManifest);
            console.log('Loaded default theme from manifest.json:', themeFromManifest);
          }
        })
        .catch(error => {
          console.error('Error loading theme from manifest.json:', error);
        });
    }
  }, []);

  // Función para cambiar el tema
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('appTheme', newTheme);
    
    // Aplicar las variables CSS correspondientes al tema
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Aplicar el tema al cargar el componente
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
