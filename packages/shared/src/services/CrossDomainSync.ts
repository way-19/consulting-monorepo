export interface CrossDomainMessage {
  type: 'COUNTRY_CONFIG_UPDATED' | 'REQUEST_SYNC' | 'SYNC_RESPONSE';
  data?: any;
  timestamp: number;
}

export class CrossDomainSync {
  private static instance: CrossDomainSync;
  private listeners: Set<(data: any) => void> = new Set();
  private targetOrigins: string[] = [
    'http://localhost:5173', // Marketing app
    'http://localhost:5174', // Admin app
  ];

  private constructor() {
    this.setupMessageListener();
    this.setupStorageListener();
  }

  public static getInstance(): CrossDomainSync {
    if (!CrossDomainSync.instance) {
      CrossDomainSync.instance = new CrossDomainSync();
    }
    return CrossDomainSync.instance;
  }

  private setupMessageListener(): void {
    window.addEventListener('message', (event) => {
      // Verify origin for security
      if (!this.targetOrigins.includes(event.origin)) {
        return;
      }

      try {
        const message: CrossDomainMessage = event.data;
        
        if (message && typeof message === 'object' && message.type) {
          console.log('CrossDomainSync received message:', message);
          
          switch (message.type) {
            case 'COUNTRY_CONFIG_UPDATED':
              this.handleCountryConfigUpdate(message.data);
              break;
            case 'REQUEST_SYNC':
              this.handleSyncRequest(event.source as Window, event.origin);
              break;
            case 'SYNC_RESPONSE':
              this.handleSyncResponse(message.data);
              break;
          }
        }
      } catch (error) {
        console.error('Error processing cross-domain message:', error);
      }
    });
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'crossDomainSync' && event.newValue) {
        try {
          const message: CrossDomainMessage = JSON.parse(event.newValue);
          
          if (message && typeof message === 'object' && message.type) {
            console.log('CrossDomainSync received storage event:', message);
            
            switch (message.type) {
              case 'COUNTRY_CONFIG_UPDATED':
                this.handleCountryConfigUpdate(message.data);
                break;
              case 'REQUEST_SYNC':
                // For storage events, we can't respond directly, so just handle locally
                console.log('Sync request received via storage event');
                break;
              case 'SYNC_RESPONSE':
                this.handleSyncResponse(message.data);
                break;
            }
          }
        } catch (error) {
          console.error('Error processing storage event:', error);
        }
      }
    });
  }

  private handleCountryConfigUpdate(data: any): void {
    console.log('Handling country config update:', data);
    
    // Update localStorage with the new data
    if (data && data.key && data.value) {
      localStorage.setItem(data.key, data.value);
      console.log('Updated localStorage:', data.key);
    }

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in cross-domain sync listener:', error);
      }
    });
  }

  private handleSyncRequest(source: Window, origin: string): void {
    console.log('Handling sync request from:', origin);
    
    // Send current localStorage data
    const countryConfigs = localStorage.getItem('countryConfigurations');
    
    const response: CrossDomainMessage = {
      type: 'SYNC_RESPONSE',
      data: {
        countryConfigurations: countryConfigs
      },
      timestamp: Date.now()
    };

    source.postMessage(response, origin);
  }

  private handleSyncResponse(data: any): void {
    console.log('Handling sync response:', data);
    
    if (data && data.countryConfigurations) {
      localStorage.setItem('countryConfigurations', data.countryConfigurations);
      console.log('Synced countryConfigurations from other app');
      
      // Notify listeners
      this.listeners.forEach(listener => {
        try {
          listener({ key: 'countryConfigurations', value: data.countryConfigurations });
        } catch (error) {
          console.error('Error in sync response listener:', error);
        }
      });
    }
  }

  public notifyCountryConfigUpdate(key: string, value: string): void {
    console.log('Broadcasting country config update:', key);
    
    const message: CrossDomainMessage = {
      type: 'COUNTRY_CONFIG_UPDATED',
      data: { key, value },
      timestamp: Date.now()
    };

    // Only broadcast to parent and opener windows if they exist and are different
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
      }
    } catch (error) {
      // Silently ignore cross-origin errors
    }
    
    try {
      if (window.opener && window.opener !== window) {
        window.opener.postMessage(message, '*');
      }
    } catch (error) {
      // Silently ignore cross-origin errors
    }

    // For same-origin communication, use localStorage events as fallback
    // This will trigger storage events in other tabs/windows of the same origin
    try {
      const storageEvent = new StorageEvent('storage', {
        key: 'crossDomainSync',
        newValue: JSON.stringify(message),
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);
    } catch (error) {
      // Silently ignore if storage events are not supported
    }
  }

  public requestSync(): void {
    console.log('Requesting sync from other apps');
    
    const message: CrossDomainMessage = {
      type: 'REQUEST_SYNC',
      timestamp: Date.now()
    };

    // Only try requesting from parent and opener windows if they exist
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
      }
    } catch (error) {
      // Silently ignore cross-origin errors
    }
    
    try {
      if (window.opener && window.opener !== window) {
        window.opener.postMessage(message, '*');
      }
    } catch (error) {
      // Silently ignore cross-origin errors
    }

    // For same-origin communication, use localStorage events
    try {
      const storageEvent = new StorageEvent('storage', {
        key: 'crossDomainSync',
        newValue: JSON.stringify(message),
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);
    } catch (error) {
      // Silently ignore if storage events are not supported
    }
  }

  public addListener(listener: (data: any) => void): void {
    this.listeners.add(listener);
  }

  public removeListener(listener: (data: any) => void): void {
    this.listeners.delete(listener);
  }

  public destroy(): void {
    this.listeners.clear();
  }
}

export default CrossDomainSync;