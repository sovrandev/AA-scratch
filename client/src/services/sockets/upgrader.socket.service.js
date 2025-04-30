import { upgraderSocket } from '../websocket.service';

class UpgraderSocketService {
  async getItemList(page = 1, search = '', sort = 'highest', minPrice = 0, maxPrice = 4000) {
    return this.emitWithPromise('getItemList', { page, search, sort, minPrice, maxPrice });
  }

  async sendBet(amount, amountPayout, mode) {
    return this.emitWithPromise('sendBet', { 
      amount, 
      amountPayout, 
      mode 
    });
  }

  // Helper method
  emitWithPromise(event, data = {}) {
    return new Promise((resolve, reject) => {
      if (!upgraderSocket) {
        reject(new Error('Socket not connected'));
        return;
      }

      upgraderSocket.emit(event, data, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error?.message || 'Request failed'));
        }
      });
    });
  }

  // Event listeners
  onItemUpdate(callback) {
    upgraderSocket?.on('itemUpdate', callback);
    return () => upgraderSocket?.off('itemUpdate', callback);
  }
}

export const upgraderSocketService = new UpgraderSocketService(); 