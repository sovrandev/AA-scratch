import { minesSocket } from "../websocket.service";

class MinesSocketService {

  // Game actions
  async sendBet(amount, minesCount) {
    return this.emitWithPromise('sendBet', { amount, minesCount });
  }

  async sendReveal(tile) {
    return this.emitWithPromise('sendReveal', { tile });
  }

  async sendCashout() {
    return this.emitWithPromise('sendCashout');
  }

  // Helper method to handle socket emissions with Promise
  emitWithPromise(event, data = {}) {
    return new Promise((resolve, reject) => {
      if (!minesSocket) {
        reject(new Error('Socket not connected'));
        return;
      }

      minesSocket.emit(event, data, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error?.message || 'Request failed'));
        }
      });
    });
  }

  // Event listeners
  onInit(callback) {
    minesSocket?.on('init', callback);
    return () => minesSocket?.off('init', callback);
  }
}

export const minesSocketService = new MinesSocketService();
