import * as signalR from '@microsoft/signalr';
import { API_CONFIG } from '../config/api.config';

/**
 * SignalR service for handling real-time notifications
 */
class SignalRService {
  private connection: signalR.HubConnection | null;
  private callbacks: { [key: string]: (data: any) => void };
  private isConnected: boolean;
  private baseUrl: string;

  constructor() {
    this.connection = null;
    this.callbacks = {};
    this.isConnected = false;
    this.baseUrl = API_CONFIG.BASE_URL || '';
  }

  /**
   * Starts the SignalR connection
   * @param {string} baseUrl - Optional base URL override
   * @returns {Promise<void>}
   */
  async start(baseUrl?: string): Promise<void> {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }

    if (this.isConnected) {
      console.log('SignalR connection already established');
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/nucleoHub`)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry intervals in milliseconds
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Register handlers for Mercado Pago notifications
    this.connection.on('BroadcastCheckoutApprovedData', (preferenceId: string) => {
      console.log('Received checkout approved notification for preference:', preferenceId);
      if (this.callbacks['checkoutApproved']) {
        this.callbacks['checkoutApproved'](preferenceId);
      }
    });

    // Register handler for partner order notifications
    this.connection.on('BroadcastPartnerOrderData', (data: any) => {
      console.log('Received partner order notification:', data);
      if (this.callbacks['partnerOrderUpdated']) {
        this.callbacks['partnerOrderUpdated'](data);
      }
    });

    // Handle connection events
    this.connection.onreconnecting((error?: Error) => {
      console.warn('SignalR connection lost. Attempting to reconnect...', error);
      this.isConnected = false;
    });

    this.connection.onreconnected((connectionId?: string) => {
      console.log('SignalR connection reestablished. ConnectionId:', connectionId);
      this.isConnected = true;
      this._joinGroups();
    });

    this.connection.onclose((error?: Error) => {
      console.warn('SignalR connection closed', error);
      this.isConnected = false;
    });

    try {
      await this.connection.start();
      console.log('SignalR Connected');
      this.isConnected = true;
      
      // Join notification groups
      await this._joinGroups();
    } catch (err) {
      console.error('Error starting SignalR connection:', err);
      this.isConnected = false;
      // Retry connection after a delay
      setTimeout(() => this.start(), 5000);
    }
  }

  /**
   * Join notification groups
   * @private
   */
  private async _joinGroups(): Promise<void> {
    if (!this.connection) return;

    try {
      // Join the MercadoPago notification group
      await this.connection.invoke('AddToGroup', 'MercadoPagoCheckoutNotificationGroup');
      console.log('Joined MercadoPagoCheckoutNotificationGroup');
      
      // Join company-specific groups if needed
      const companyId = sessionStorage.getItem('companyId');
      if (companyId) {
        await this.connection.invoke('AddToGroup', `PartnerOrderGroup${companyId}`);
        console.log(`Joined PartnerOrderGroup${companyId}`);
      } else {
        console.warn('No companyId found in sessionStorage, skipping company-specific group');
      }
    } catch (error) {
      console.error('Error joining SignalR groups:', error);
    }
  }

  /**
   * Register a callback for a specific event
   * @param {string} event - The event name
   * @param {Function} callback - The callback function
   */
  on(event: string, callback: (data: any) => void): void {
    this.callbacks[event] = callback;
  }

  /**
   * Remove a callback for a specific event
   * @param {string} event - The event name
   */
  off(event: string): void {
    delete this.callbacks[event];
  }

  /**
   * Stop the SignalR connection
   * @returns {Promise<void>}
   */
  async stop(): Promise<void> {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.stop();
        console.log('SignalR Disconnected');
        this.isConnected = false;
      } catch (err) {
        console.error('Error stopping SignalR connection:', err);
      }
    }
  }
}

// Export a singleton instance
export const signalRService = new SignalRService();
