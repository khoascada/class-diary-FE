import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import { X, Camera, User, Mail, Phone, MapPin, Calendar, Edit3, Save, XCircle } from 'lucide-react';

const UserInfoModal = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    phone: '+84 123 456 789',
    address: 'Hà Nội, Việt Nam',
    joinDate: '15/03/2023',
    avatar: null,
  });

  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      styles={{ body: { padding: 0 } }}
      width={400}
      closeIcon={<X size={20} />}
    >
      {/* Header */}
      <div className="rounded-t-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
        {/* Avatar */}
        <div className="relative inline-block">
          <div className="bg-opacity-20 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt="Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {userInfo.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </span>
            )}
          </div>
          {isEditing && (
            <button className="absolute right-2 bottom-2 rounded-full bg-white p-2 text-gray-600 shadow-lg transition-colors hover:bg-gray-50">
              <Camera size={16} />
            </button>
          )}
        </div>

        <h2 className="mb-1 text-xl font-bold text-white">{userInfo.name}</h2>
        <p className="text-opacity-90 text-sm text-white">{userInfo.email}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Edit / Save buttons */}
        <div className="mb-4 flex justify-end gap-2">
          {!isEditing ? (
            <Button type="primary" icon={<Edit3 size={16} />} onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button danger icon={<XCircle size={16} />} onClick={handleCancelEdit}>
                Hủy
              </Button>
              <Button type="primary" icon={<Save size={16} />} onClick={handleSave}>
                Lưu
              </Button>
            </>
          )}
        </div>

        {/* User Info Fields */}
        <div className="space-y-4">
          {/* Tên */}
          <div className="flex items-center gap-3">
            <User className="text-gray-500" size={20} />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">Họ và tên</label>
              {isEditing ? (
                <Input
                  value={editedInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  size="middle"
                />
              ) : (
                <p className="font-medium text-gray-800">{userInfo.name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="text-gray-500" size={20} />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">Email</label>
              {isEditing ? (
                <Input
                  value={editedInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  size="middle"
                />
              ) : (
                <p className="font-medium text-gray-800">{userInfo.email}</p>
              )}
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center gap-3">
            <Phone className="text-gray-500" size={20} />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
              {isEditing ? (
                <Input
                  value={editedInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  size="middle"
                />
              ) : (
                <p className="font-medium text-gray-800">{userInfo.phone}</p>
              )}
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-center gap-3">
            <MapPin className="text-gray-500" size={20} />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
              {isEditing ? (
                <Input
                  value={editedInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  size="middle"
                />
              ) : (
                <p className="font-medium text-gray-800">{userInfo.address}</p>
              )}
            </div>
          </div>

          {/* Ngày tham gia */}
          <div className="flex items-center gap-3">
            <Calendar className="text-gray-500" size={20} />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">Ngày tham gia</label>
              <p className="font-medium text-gray-800">{userInfo.joinDate}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserInfoModal;
