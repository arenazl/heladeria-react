import React, { useEffect } from 'react';

/**
 * Componente que actualiza el título de la página basado en el nombre de la compañía
 * almacenado en localStorage o sessionStorage.
 */
const TitleUpdater: React.FC = () => {
  useEffect(() => {
    // Función para actualizar los metadatos
    const updateMetadata = (companyName: string) => {
      if (!companyName) return;
      
      console.log('Actualizando metadatos con nombre de compañía:', companyName);
      
      // Actualizar el título de la página
      document.title = companyName;
      
      // Actualizar la descripción
      const metaDescription = document.getElementById('meta-description');
      if (metaDescription) {
        const defaultDescription = metaDescription.getAttribute('data-default') || 'Ordena comida deliciosa para llevar';
        metaDescription.setAttribute('content', companyName + ' - ' + defaultDescription);
      }
      
      // Actualizar el título de la app para iOS
      const metaAppTitle = document.getElementById('meta-app-title');
      if (metaAppTitle) {
        metaAppTitle.setAttribute('content', companyName);
      }
      
      // Guardar el nombre de la compañía en localStorage para que esté disponible en otras páginas
      try {
        localStorage.setItem('companyName', companyName);
      } catch (error) {
        console.error('Error al guardar el nombre de la compañía en localStorage:', error);
      }
    };
    
    // Verificar si hay un nombre de compañía en sessionStorage o localStorage
    const checkCompanyName = () => {
      try {
        // Intentar obtener el nombre de la compañía del sessionStorage
        const menuData = sessionStorage.getItem('menuData');
        if (menuData) {
          try {
            const parsedData = JSON.parse(menuData);
            if (parsedData && parsedData.companyName) {
              updateMetadata(parsedData.companyName);
              return;
            }
          } catch (parseError) {
            console.error('Error al analizar datos del menú:', parseError);
          }
        }
        
        // También verificar si hay un nombre de compañía en localStorage
        const localMenuData = localStorage.getItem('menuData');
        if (localMenuData) {
          try {
            const parsedLocalData = JSON.parse(localMenuData);
            if (parsedLocalData && parsedLocalData.companyName) {
              updateMetadata(parsedLocalData.companyName);
              return;
            }
          } catch (parseError) {
            console.error('Error al analizar datos locales del menú:', parseError);
          }
        }
        
        // Si hay un nombre de compañía guardado directamente en localStorage
        const companyName = localStorage.getItem('companyName');
        if (companyName) {
          updateMetadata(companyName);
          return;
        }
      } catch (error) {
        console.error('Error al actualizar metadatos:', error);
      }
    };
    
    // Iniciar la verificación
    checkCompanyName();
    
    // Configurar un intervalo para verificar periódicamente
    const interval = setInterval(checkCompanyName, 1000);
    
    // También escuchar cambios en el almacenamiento para actualizar en tiempo real
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'menuData' || e.key === 'companyName') {
        checkCompanyName();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Limpiar el intervalo y el event listener cuando el componente se desmonte
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Este componente no renderiza nada visible
  return null;
};

export default TitleUpdater;
