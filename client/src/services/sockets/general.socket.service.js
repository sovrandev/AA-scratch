import { generalSocket } from '../websocket.service';

class GeneralSocketService {
  // Affiliate
  async getAffiliateData() {
    return this.emitWithPromise('getAffiliateData');
  }

  async sendAffiliateCode(code) {
    return this.emitWithPromise('sendAffiliateCode', { code });
  }

  async sendAffiliateClaimCode(code) {
    return this.emitWithPromise('sendAffiliateClaimCode', code);
  }

  async sendAffiliateClaimEarnings() {
    return this.emitWithPromise('sendAffiliateClaimEarnings');
  }

  // Bets
  async getBetsData() {
    return this.emitWithPromise('getBetsData');
  }

  // Chat
  async getChatMessages(room) {
    return this.emitWithPromise('getChatMessages', { room });
  }

  async sendChatMessage(message) {
    return this.emitWithPromise('sendChatMessage', { message });
  }

  async sendChatRemove(messageId) {
    return this.emitWithPromise('sendChatRemove', { messageId });
  }

  async sendChatClear() {
    return this.emitWithPromise('sendChatClear');
  }

  async sendChatLock() {
    return this.emitWithPromise('sendChatLock');
  }

  // User
  async getUserInfo(userId, page = 1) {
    return this.emitWithPromise('getUserInfo', { userId });
  }

  async getUserBets(userId, page = 1) {
    return this.emitWithPromise('getUserBets', { userId, page });
  }

  async getUserTransactions(userId, page = 1) {
    return this.emitWithPromise('getUserTransactions', { userId, page });
  }

  async getUserDeposits(page = 1) {
    return this.emitWithPromise('getUserDeposits', { page });
  }

  async getUserWithdrawals(page = 1) {
    return this.emitWithPromise('getUserWithdrawals', { page });
  }

  async getUserBattleHistory(page = 1) {
    return this.emitWithPromise('getUserBattleHistory', { page });
  }

  async getUserBoxHistory(page = 1) {
    return this.emitWithPromise('getUserBoxHistory', { page });
  }

  async getUserUpgraderHistory(page = 1) {
    return this.emitWithPromise('getUserUpgraderHistory', { page });
  }

  async getUserMinesHistory(page = 1) {
    return this.emitWithPromise('getUserMinesHistory', { page });
  }

  async getUserSeed() {
    return this.emitWithPromise('getUserSeed');
  }

  async getUserSeedHistory(page = 1) {
    return this.emitWithPromise('getUserSeedHistory', { page });
  }

  async sendUserSeed(seed) {
    return this.emitWithPromise('sendUserSeed', { seedClient: seed });
  }

  async sendUserAnonymous(anonymous) {
    return this.emitWithPromise('sendUserAnonymous', { anonymous });
  }

  async sendUserDiscord(code) {
    return this.emitWithPromise('sendUserDiscord', { code });
  }

  async sendUserTip(userId, amount) {
    return this.emitWithPromise('sendUserTip', { userId, amount });
  }

  async sendUserUpdateUsername(username) {
    return this.emitWithPromise('sendUserUpdateUsername', { username });
  }

  async sendUserUpdateAvatar(avatar) {
    return this.emitWithPromise('sendUserUpdateAvatar', { avatar });
  }

  // Vault
  async sendVaultDeposit(amount) {
    return this.emitWithPromise('sendVaultDeposit', { amount });
  }

  async sendVaultWithdraw(amount) {
    return this.emitWithPromise('sendVaultWithdraw', { amount });
  }

  async sendVaultLock(time) {
    return this.emitWithPromise('sendVaultLock', { time });
  }

  // Rain
  async sendRainCreate(amount) {
    return this.emitWithPromise('sendRainCreate', { amount });
  }

  async sendRainTip(rainId, amount) {
    return this.emitWithPromise('sendRainTip', { rainId, amount });
  }

  async sendRainJoin(rainId) {
    return this.emitWithPromise('sendRainJoin', { rainId });
  }

  // Rakeback
  async getRakebackData() {
    return this.emitWithPromise('getRakebackData');
  }

  async sendRakebackClaim(type) {
    return this.emitWithPromise('sendRakebackClaim', { type });
  }

  async sendRakebackBoxClaim(boxId, level) {
    return this.emitWithPromise('sendRakebackBoxClaim', { boxId, level });
  }

  // Promo
  async sendPromoClaim(code) {
    return this.emitWithPromise('sendPromoClaim', { code });
  }

  // Leaderboard
  async getLeaderboardData() {
    return this.emitWithPromise('getLeaderboardData');
  }

  // Settings
  async getSettings() {
    return this.emitWithPromise('getSettings');
  }

  // Helper method to handle socket emissions with Promise
  emitWithPromise(event, data = {}) {
    return new Promise((resolve, reject) => {
      if (!generalSocket) {
        reject(new Error('Socket not connected'));
        return;
      }

      generalSocket.emit(event, data, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error?.message || 'Request failed'));
        }
      });
    });
  }

  // Event listeners
  onUserUpdate(callback) {
    generalSocket?.on('user', callback);
    return () => generalSocket?.off('user', callback);
  }

  onDrop(callback) {
    generalSocket?.on('drop', callback);
    return () => generalSocket?.off('drop', callback);
  }

  onChatMessage(callback) {
    generalSocket?.on('chatMessage', callback);
    return () => generalSocket?.off('chatMessage', callback);
  }

  onChatRemove(callback) {
    generalSocket?.on('chatRemove', callback);
    return () => generalSocket?.off('chatRemove', callback);
  }

  onChatOnline(callback) {
    generalSocket?.on('chatOnline', callback);
    return () => generalSocket?.off('chatOnline', callback);
  }

  onChatClear(callback) {
    generalSocket?.on('chatClear', callback);
    return () => generalSocket?.off('chatClear', callback);
  }

  onRainUpdate(callback) {
    generalSocket?.on('rain', callback);
    return () => generalSocket?.off('rain', callback);
  }

  onInit(callback) {
    generalSocket?.on('init', callback);
    return () => generalSocket?.off('init', callback);
  }

  onSettingsUpdate(callback) {
    generalSocket?.on('settings', callback);
    return () => generalSocket?.off('settings', callback);
  }
}

export const generalSocketService = new GeneralSocketService(); 