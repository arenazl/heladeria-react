// Interfaz para la información de una empresa visitada
export interface VisitedCompany {
  id: string;
  name: string;
  priceListId: string;
  visitDate: string; // ISO string
}

class VisitedCompaniesService {
  private readonly STORAGE_KEY = 'visitedCompanies';

  // Obtener todas las empresas visitadas
  getVisitedCompanies(): VisitedCompany[] {
    const companiesStr = localStorage.getItem(this.STORAGE_KEY);
    if (!companiesStr) {
      return [];
    }
    
    try {
      return JSON.parse(companiesStr);
    } catch (error) {
      console.error('Error parsing visited companies:', error);
      return [];
    }
  }

  // Guardar una nueva empresa visitada
  saveVisitedCompany(company: VisitedCompany): void {
    const companies = this.getVisitedCompanies();
    
    // Verificar si la empresa ya existe
    const existingIndex = companies.findIndex(c => c.id === company.id);
    
    if (existingIndex >= 0) {
      // Actualizar la fecha de visita si ya existe
      companies[existingIndex].visitDate = company.visitDate;
    } else {
      // Agregar la nueva empresa
      companies.push(company);
    }
    
    // Guardar en localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(companies));
  }

  // Eliminar una empresa visitada
  removeVisitedCompany(companyId: string): void {
    let companies = this.getVisitedCompanies();
    companies = companies.filter(company => company.id !== companyId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(companies));
  }

  // Verificar si una empresa ya ha sido visitada
  isCompanyVisited(companyId: string): boolean {
    const companies = this.getVisitedCompanies();
    return companies.some(company => company.id === companyId);
  }

  // Obtener una empresa visitada por su ID
  getVisitedCompanyById(companyId: string): VisitedCompany | undefined {
    const companies = this.getVisitedCompanies();
    return companies.find(company => company.id === companyId);
  }
}

// Crear una instancia singleton
export const visitedCompaniesService = new VisitedCompaniesService();
