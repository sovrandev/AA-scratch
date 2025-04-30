import { unboxSocket } from '../websocket.service';

class UnboxSocketService {
  async getBoxData(boxId) {
    return this.emitWithPromise('getBoxData', { boxId });
  }

  async openBox(boxId, unboxCount = 1) {
    return this.emitWithPromise('sendBet', { boxId, unboxCount });
  }

  // Helper method
  emitWithPromise(event, data = {}) {
    return new Promise((resolve, reject) => {
      if (!unboxSocket) {
        reject(new Error('Socket not connected'));
        return;
      }

      unboxSocket.emit(event, data, (response) => {
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
    unboxSocket?.on('init', callback);
    return () => unboxSocket?.off('init', callback);
  }
}

export const unboxSocketService = new UnboxSocketService(); 