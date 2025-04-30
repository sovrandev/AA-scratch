import { adminSocket } from "../websocket.service";

class AdminSocketService {
  // Helper method
  emitWithPromise(event, data = {}) {
    return new Promise((resolve, reject) => {
      if (!adminSocket) {
        reject(new Error('Socket not connected'));
        return;
      }

      adminSocket.emit(event, data, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error.message || 'Request failed'));
        }
      });
    });
  }

  // User Management
  getUserList(page, search, sort) {
    return this.emitWithPromise('getUserList', { page, search, sort });
  }

  sendUserValue({ userId, setting, value }) {
    return this.emitWithPromise('sendUserValue', { userId, setting, value });
  }

  sendUserBalance({ userId, balance }) {
    return this.emitWithPromise('sendUserBalance', { userId, balance });
  }

  sendUserMute({ userId, time, reason }) {
    return this.emitWithPromise('sendUserMute', { userId, time, reason });
  }

  sendUserBan({ userId, time, reason }) {
    return this.emitWithPromise('sendUserBan', { userId, time, reason });
  }

  getUserGameList(userId, page) {
    return this.emitWithPromise('getUserGameList', { userId, page });
  }

  getUserTransactionList(userId, page) {
    return this.emitWithPromise('getUserTransactionList', { userId, page });
  }

  getStatsData() {
    return this.emitWithPromise('getStatsData');
  }

  getStatsList(data) {
    return this.emitWithPromise('getStatsList', data);
  }

  sendSettingValue(setting, value) {
    return this.emitWithPromise('sendSettingValue', { setting, value });
  }

  // Box Management
  getBoxList(page, search) {
    return this.emitWithPromise('getBoxList', { page, search });
  }

  sendBoxCreate(boxData) {
    return this.emitWithPromise('sendBoxCreate', boxData);
  }

  sendBoxRemove({ boxId }) {
    return this.emitWithPromise('sendBoxRemove', { boxId });
  }

  // Filter Management
  getFilterList(page, search) {
    return this.emitWithPromise('getFilterList', { page, search });
  }

  sendFilterCreate({ phrase }) {
    return this.emitWithPromise('createFilter', { phrase });
  }

  sendFilterRemove({ filterId }) {
    return this.emitWithPromise('removeFilter', { filterId });
  }

  getUserData({ userId }) {
    return this.emitWithPromise('getUserData', { userId });
  }

  // Rain Management
  getRainHistory(search) {
    return this.emitWithPromise('getRainHistory', { search });
  }

  createRain(data) {
    return this.emitWithPromise('createRain', data);
  }

  cancelRain({ rainId }) {
    return this.emitWithPromise('cancelRain', { rainId });
  }

  // Affiliate Management
  getAffiliateList(page, search, sort) {
    return this.emitWithPromise('getAffiliateList', { page, search, sort });
  }

  sendAffiliateBlock({ userId, block }) {
    return this.emitWithPromise('sendAffiliateBlock', { userId, block });
  }

  sendAffiliateClear({ userId }) {
    return this.emitWithPromise('sendAffiliateClear', { userId });
  }

  sendAffiliateCode({ userId, code }) {
    return this.emitWithPromise('sendAffiliateCode', { userId, code });
  }

  sendAffiliateAvailable({ userId, amount }) {
    return this.emitWithPromise('sendAffiliateAvailable', { userId, amount });
  }

  updateAffiliateSettings({ commissionRate, minCommission, maxCommission }) {
    return this.emitWithPromise('updateAffiliateSettings', { 
      commissionRate, 
      minCommission, 
      maxCommission 
    });
  }

  blockAffiliate({ userId }) {
    return this.emitWithPromise('blockAffiliate', { userId });
  }

  // Cashier Methods
  getCashierList(page, search) {
    return this.emitWithPromise('getCashierList', { page, search });
  }

  getCashierStats() {
    return this.emitWithPromise('getCashierStats');
  }

  createCashierTransaction(data) {
    return this.emitWithPromise('sendCashierCreate', data);
  }

  // Leaderboard Management
  getLeaderboardList(page, search) {
    return this.emitWithPromise('getLeaderboardList', { page, search });
  }

  createLeaderboard({ type, prizes, duration }) {
    return this.emitWithPromise('sendLeaderboardCreate', { type, prizes, duration });
  }

  stopLeaderboard(leaderboardId) {
    return this.emitWithPromise('sendLeaderboardStop', { leaderboardId });
  }

  // Ledger Methods
  getLedgerTransactions(page, filters, search) {
    return this.emitWithPromise('getLedgerTransactions', { 
      page, 
      filters,
      search
    });
  }

  getLedgerBalances() {
    return this.emitWithPromise('getLedgerBalances');
  }

  // Wallet Methods
  getWalletBalances() {
    return this.emitWithPromise('getWalletBalances');
  }

  updateWalletAddress(currency, address) {
    return this.emitWithPromise('updateWalletAddress', { currency, address });
  }

  syncWalletBalances() {
    return this.emitWithPromise('syncWalletBalances');
  }

  // Streamers Methods
  getStreamers(page, search, sort) {
    return this.emitWithPromise('getStreamers', { page, search, sort });
  }

  getStreamerUsers(streamerId, page, search) {
    return this.emitWithPromise('getStreamerUsers', { streamerId, page, search });
  }

  getStreamerStats(streamerId) {
    return this.emitWithPromise('getStreamerStats', { streamerId });
  }

  setStreamerRole(userId, isStreamer) {
    return this.emitWithPromise('setStreamerRole', { userId, isStreamer });
  }

  updateStreamerStatus(streamerId, status) {
    return this.emitWithPromise('updateStreamerStatus', { streamerId, status });
  }

  // Event listeners
  onSettingUpdate(callback) {
    adminSocket?.on('settingUpdate', callback);
    return () => adminSocket?.off('settingUpdate', callback);
  }

  onUserUpdate(callback) {
    adminSocket?.on('userUpdate', callback);
    return () => adminSocket?.off('userUpdate', callback);
  }

  onStatsUpdate(callback) {
    adminSocket?.on('statsUpdate', callback);
    return () => adminSocket?.off('statsUpdate', callback);
  }

  // Admin Actions
  getAdminActions(data) {
    return this.emitWithPromise('getAdminActions', data);
  }
}

export const adminSocketService = new AdminSocketService(); 