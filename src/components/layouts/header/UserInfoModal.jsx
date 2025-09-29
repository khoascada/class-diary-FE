import React, { useState } from 'react';
import {Button, Modal, Input} from "antd"
import { X, Camera, User, Mail, Phone, MapPin, Calendar, Edit3, Save, XCircle } from 'lucide-react';

const UserInfoModal = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Nguyễn Văn An",
    email: "nguyenvanan@example.com",
    phone: "+84 123 456 789",
    address: "Hà Nội, Việt Nam",
    joinDate: "15/03/2023",
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
      styles={{body: {padding:0}}}
      width={400}
      closeIcon={<X size={20} />}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl text-center">
        {/* Avatar */}
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 shadow-lg mx-auto">
            {userInfo.avatar ? (
              <img src={userInfo.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-bold">
                {userInfo.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            )}
          </div>
          {isEditing && (
            <button className="absolute bottom-2 right-2 bg-white text-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
              <Camera size={16} />
            </button>
          )}
        </div>

        <h2 className="text-white text-xl font-bold mb-1">{userInfo.name}</h2>
        <p className="text-white text-opacity-90 text-sm">{userInfo.email}</p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Edit / Save buttons */}
        <div className="flex justify-end mb-4 gap-2">
          {!isEditing ? (
            <Button
              type="primary"
              icon={<Edit3 size={16} />}
              onClick={() => setIsEditing(true)}
            >
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
              <label className="text-sm text-gray-500 font-medium">Họ và tên</label>
              {isEditing ? (
                <Input
                  value={editedInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  size="middle"
                />
              ) : (
                <p className="text-gray-800 font-medium">{userInfo.name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="text-gray-500" size={20} />
            <div className="flex-1">
              <label className="text-sm text-gray-500 font-medium">Email</label>
              {isEditing ? (
                <Input
                  value={editedInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  size="middle"
                />
              ) : (
                <p className="text-gray-800 font-medium">{userInfo.email}</p>
              )}
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center gap-3">
            <Phone className="text-gray-500" size={20} />
            <div className="flex-1">
              <label className="text-sm text-gray-500 font-medium">Số điện thoại</label>
              {isEditing ? (
                <Input
                  value={editedInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  size="middle"
                />
              ) : (
                <p className="text-gray-800 font-medium">{userInfo.phone}</p>
              )}
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-center gap-3">
            <MapPin className="text-gray-500" size={20} />
            <div className="flex-1">
              <label className="text-sm text-gray-500 font-medium">Địa chỉ</label>
              {isEditing ? (
                <Input
                  value={editedInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  size="middle"
                />
              ) : (
                <p className="text-gray-800 font-medium">{userInfo.address}</p>
              )}
            </div>
          </div>

          {/* Ngày tham gia */}
          <div className="flex items-center gap-3">
            <Calendar className="text-gray-500" size={20} />
            <div className="flex-1">
              <label className="text-sm text-gray-500 font-medium">Ngày tham gia</label>
              <p className="text-gray-800 font-medium">{userInfo.joinDate}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};



export default UserInfoModal;