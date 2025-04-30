// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    settingSetValue
} = require('../../../utils/setting');
const {
    adminCheckSendSettingValueData
} = require('../../../utils/admin/setting');

// Import admin action logging
const { logAdminAction } = require('../actions');

const adminSendSettingValueSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendSettingValueData(data);

        // Update settings in database
        const settings = await settingSetValue(data.setting, data.value);

        // Log admin action
        const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
        await logAdminAction(
            user, 
            'setting_change', 
            'setting', 
            null, 
            null, 
            { 
                setting: data.setting, 
                value: data.value 
            },
            identifier
        );

        // Sent the updated settings to all connected users
        io.of('/general').emit('settings', { settings: settings });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminSendSettingValueSocket
}
