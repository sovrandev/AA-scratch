import { battlesSocket } from '../websocket.service';

class BattlesSocketService {
  // Game actions
  async sendCreate(data) {
    return this.emitWithPromise('sendCreate', {
      playerCount: data.playerCount,
      mode: data.mode,
      boxes: data.boxes,
      levelMin: 0,
      funding: 0,
      private: false,
      affiliateOnly: false,
      cursed: data.cursed,
      terminal: data.terminal,
      jackpot: data.jackpot,
      bigSpin: data.bigSpin
    });
  }

  async sendJoin(gameId, slot) {
    return this.emitWithPromise('sendJoin', { gameId, slot });
  }

  async sendBot(gameId) {
    return this.emitWithPromise('sendBot', { gameId });
  }

  async sendCancel(gameId) {
    return this.emitWithPromise('sendCancel', { gameId });
  }

  async sendGetGameData(gameId) {
    return this.emitWithPromise('getGameData', { gameId });
  }

  // Helper method
  emitWithPromise(event, data = {}) {
    return new Promise((resolve, reject) => {
      if (!battlesSocket) {
        reject(new Error('Socket not connected'));
        return;
      }

      battlesSocket.emit(event, data, (response) => {
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
    battlesSocket?.on('init', callback);
    return () => battlesSocket?.off('init', callback);
  }

  onGame(callback) {
    battlesSocket?.on('game', callback);
    return () => battlesSocket?.off('game', callback);
  }
}

export const battlesSocketService = new BattlesSocketService(); 