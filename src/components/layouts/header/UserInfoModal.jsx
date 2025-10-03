import React, { useState } from 'react';
import { Modal, Input, Button, Tabs, Upload, App } from 'antd';
import { Camera, User, Mail, Phone, Lock, Save, XCircle } from 'lucide-react';

const { TabPane } = Tabs;

const UserInfoModal = ({ isOpen, onClose }) => {
  const { message } = App.useApp();
  const [userInfo, setUserInfo] = useState({
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    phone: '+84 123 456 789',
    avatar: null,
  });

  const [editedInfo, setEditedInfo] = useState({ ...userInfo });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Avatar upload handler
  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditedInfo((prev) => ({ ...prev, avatar: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field, value) => {
    setEditedInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveInfo = () => {
    setUserInfo(editedInfo);
    setIsEditingInfo(false);
    message.success('Cập nhật thông tin thành công!');
  };

  const handleSavePassword = () => {
    if (passwords.new !== passwords.confirm) {
      message.error('Mật khẩu mới không khớp!');
      return;
    }
    // Thêm logic call API đổi mật khẩu ở đây
    message.success('Đổi mật khẩu thành công!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      closeIcon={<XCircle size={20} />}
    >
      <Tabs defaultActiveKey="1">
        {/* Thông tin cá nhân */}
        <TabPane tab="Thông tin cá nhân" key="1">
          <div className="p-4 text-center">
            <div className="relative mb-4 inline-block">
              <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200 shadow-lg">
                {editedInfo.avatar ? (
                  <img
                    src={editedInfo.avatar}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-500">
                    {userInfo.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                )}
              </div>

              {isEditingInfo && (
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleAvatarChange}
                  className="absolute right-0 bottom-0"
                >
                  <button className="rounded-full bg-white p-2 shadow hover:bg-gray-50">
                    <Camera size={16} />
                  </button>
                </Upload>
              )}
            </div>

            <h2 className="text-xl font-bold">{userInfo.name}</h2>
            <p className="text-gray-500">{userInfo.email}</p>
          </div>

          {/* Edit / Save Buttons */}
          <div className="mb-4 flex justify-end gap-2">
            {!isEditingInfo ? (
              <Button type="primary" onClick={() => setIsEditingInfo(true)}>
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  danger
                  onClick={() => {
                    setEditedInfo({ ...userInfo });
                    setIsEditingInfo(false);
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" onClick={handleSaveInfo}>
                  Lưu
                </Button>
              </>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-gray-500" size={20} />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                {isEditingInfo ? (
                  <Input
                    value={editedInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <p className="font-medium text-gray-800">{userInfo.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-gray-500" size={20} />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500">Email</label>
                {isEditingInfo ? (
                  <Input
                    value={editedInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <p className="font-medium text-gray-800">{userInfo.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-gray-500" size={20} />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                {isEditingInfo ? (
                  <Input
                    value={editedInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <p className="font-medium text-gray-800">{userInfo.phone}</p>
                )}
              </div>
            </div>
          </div>
        </TabPane>

        {/* Đổi mật khẩu */}
        <TabPane tab="Đổi mật khẩu" key="2">
          <div className="space-y-4 p-4">
            <div className="flex items-center gap-3">
              <Lock className="text-gray-500" size={20} />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500">Mật khẩu hiện tại</label>
                <Input.Password
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Lock className="text-gray-500" size={20} />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500">Mật khẩu mới</label>
                <Input.Password
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Lock className="text-gray-500" size={20} />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500">Xác nhận mật khẩu</label>
                <Input.Password
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="primary" onClick={handleSavePassword}>
                Lưu mật khẩu
              </Button>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default UserInfoModal;
