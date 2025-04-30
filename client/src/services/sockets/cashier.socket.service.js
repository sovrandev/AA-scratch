import { cashierSocket } from '../websocket.service';

class CashierSocketService {

  // Crypto
  async getCryptoData() {
    return this.emitWithPromise('getCryptoData');
  }

  async sendCryptoWithdraw(currency, address, amount) {
    return this.emitWithPromise('sendCryptoWithdraw', { currency, address, amount });
  }

  // Gift
  async sendGiftRedeem(code) {
    return this.emitWithPromise('sendGiftRedeem', { code });
  }

  // Credit
  async sendCreditDeposit(amount) {
    return this.emitWithPromise('sendCreditDeposit', { amount });
  }

  // Helper method
  emitWithPromise(event, data = {}) {
    return new Promise((resolve, reject) => {
      if (!cashierSocket) {
        reject(new Error('Socket not connected'));
        return;
      }

      cashierSocket.emit(event, data, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error?.message || 'Request failed'));
        }
      });
    });
  }

  // Event listeners
  onTransaction(callback) {
    cashierSocket?.on('transaction', callback);
    return () => {
      // Clean up by removing both the new format and legacy format listeners
      cashierSocket?.off('transaction', callback);
      cashierSocket?.off('cryptoTransaction', callback);
    };
  }
}

export const cashierSocketService = new CashierSocketService(); 