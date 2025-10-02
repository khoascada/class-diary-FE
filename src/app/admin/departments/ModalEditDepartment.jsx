import { useEffect } from 'react';
import { Modal, Input, Select, Form } from 'antd';
import DepartmentService from '@/services/departmentService';
import { notificationService } from '@/lib/utils/notificationService';
import { useFetchService } from '@/hooks/useFetch';
import departmentService from '@/services/departmentService';
const { TextArea } = Input;
const ModalEditDepartment = ({
  visible,
  departmentInit,
  setVisible,
  fetchDepartment,
  refetchSelectedDepartment,
}) => {
  const { data: listDepartmentForParent } = useFetchService(
    () => departmentService.getListDepartmentForUpdate(departmentInit?.id),
    [departmentInit?.id],
    []
  );

  const [form] = Form.useForm();
  const handleCancelDepartment = () => {
    form.resetFields();
    setVisible(false);
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Lọc bỏ những field undefined/null
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v != null)
      );
      await DepartmentService.updateDepartment(departmentInit?.id, filteredValues);
      form.resetFields();
      fetchDepartment();
      setVisible(false);
      refetchSelectedDepartment();
      notificationService.success('Tạo thành công!');
    } catch (errorInfo) {
      console.log('Validate Failed:', errorInfo);
      notificationService.error('Có lỗi khi tạo phòng ban. Vui lòng tạo lại!');
    }
  };

  useEffect(() => {
    if (visible && departmentInit) {
      form.setFieldsValue({
        name: departmentInit.name || '',
        code: departmentInit.code || '',
        description: departmentInit.description || '',
        parent_id: departmentInit.parent_id || null,
      });
    } else if (!visible) {
      form.resetFields();
    }
  }, [visible, departmentInit, form]);

  return (
    <Modal
      title="Chỉnh sửa phòng ban"
      open={visible}
      onCancel={handleCancelDepartment}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên Phòng Ban"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên phòng ban' }]}
        >
          <Input placeholder="Ví dụ: Khối Toán - Lý" />
        </Form.Item>

        <Form.Item
          label="Mã Phòng Ban"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã phòng ban' }]}
        >
          <Input placeholder="Ví dụ: MATH_PHYS" />
        </Form.Item>

        <Form.Item label="Mô Tả" name="description">
          <TextArea rows={4} placeholder="Mô tả về phòng ban..." />
        </Form.Item>

        <Form.Item label="Phòng Ban Cha" name="parent_id">
          <Select placeholder="-- Không có (Cấp cao nhất) --" allowClear>
            {listDepartmentForParent?.map((dept) => (
              <Select.Option key={dept.id} value={dept.id}>
                {dept.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditDepartment;
