import { useState, useEffect } from 'react';
import { Modal, Select, Form, Button, Space } from 'antd';
import DepartmentService from '@/services/departmentService';
import { notificationService } from '@/lib/utils/notificationService';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const ModalAddMemberToDepartment = ({ visible, setVisible }) => {
  const [allUsers, setAllUsers] = useState([
    { id: 1, name: 'Nguyễn Khoa' },
    { id: 2, name: 'Khoa Nguyễn' },
    { id: 3, name: 'Nguyễn Phúc Đăng Khoa' },
    { id: 4, name: 'Nguyễn Khoa Điềm' },
  ]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [allRoles, setAllRoles] = useState([
    { id: 1, name_role: 'Hiệu trưởng' },
    { id: 2, name_role: 'Tổ trưởng' },
    { id: 3, name_role: 'Giáo viên' },
  ]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [form] = Form.useForm();
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Danh sách nhân sự:', values.employees);
        // values.employees sẽ có dạng:
        // [
        //   { id_user: 1, role: 'manager' },
        //   { id_user: 2, role: 'staff' },
        //   ...
        // ]

        // Gọi API thêm nhiều nhân sự
        // await addEmployeesToDepartment(values.employees);

        form.resetFields();
        handleCancel();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  console.log('selected', selectedRoles);
  return (
    <Modal
      title="Thêm nhân sự vào phòng ban"
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Thêm"
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.List
          name="employees"
          initialValue={[{ id_user: undefined, role: undefined }]} // Bắt đầu với 1 cặp
        >
          {(fields, { add, remove }) => (
            <div className="space-y-2">
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} className="flex gap-2">
                  <Form.Item
                    {...restField}
                    label={index === 0 ? 'Chức danh' : ''}
                    name={[name, 'role']}
                    rules={[{ required: true, message: 'Vui lòng chọn chức danh!' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Select
                      placeholder="Chọn chức danh"
                      onChange={(newValue) => {
                        setSelectedRoles((prev) => {
                          const updated = [...prev];
                          updated[index] = newValue; // ghi đè giá trị cũ ở vị trí index
                          return updated;
                        });
                      }}
                    >
                      {/* Danh sách chức danh */}
                      {allRoles?.map((role) => (
                        <Select.Option key={role.id} value={role.id}>
                          {role.name_role}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label={index === 0 ? 'Tên nhân sự' : ''}
                    name={[name, 'id_user']}
                    rules={[{ required: true, message: 'Vui lòng chọn nhân sự!' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Select
                      placeholder="Chọn nhân sự"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      mode="multiple"
                      allowClear
                    >
                      {/* Danh sách nhân sự */}
                      {allUsers?.map((user) => (
                        <Select.Option key={user.id} value={user.id}>
                          {user.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      style={{
                        fontSize: 20,
                        color: '#ff4d4f',
                        marginTop: index === 0 ? 30 : 0,
                      }}
                      onClick={() => remove(name)}
                    />
                  )}
                </div>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm nhân sự
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ModalAddMemberToDepartment;
