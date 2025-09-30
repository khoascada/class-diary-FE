
import { Modal, Input, Select, Form } from "antd";
import DepartmentService from "@/services/departmentService";
import { notificationService } from "@/lib/utils/notificationService";
const { TextArea } = Input;
const ModalAddDepartment = ({ visible, departments, setVisible, fetchDepartment }) => {
  const [form] = Form.useForm();
  const handleCancelDepartment = () => {
    form.resetFields();
    setVisible(false)
  };
  const handleSubmit = async () => {
  try {
    const values = await form.validateFields();

    // Lọc bỏ những field undefined/null
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v != null)
    );
    await DepartmentService.createDepartment(filteredValues)
    form.resetFields();
    fetchDepartment()
    setVisible(false)
    notificationService.success("Tạo thành công!")
    // Gọi API với filteredValues
  } catch (errorInfo) {
    console.log('Validate Failed:', errorInfo);
    notificationService.error("Có lỗi khi tạo phòng ban. Vui lòng tạo lại!")
  }
};

  return (
    <Modal
      title="Tạo Phòng Ban Mới"
      open={visible}
      onCancel={handleCancelDepartment}
      onOk={handleSubmit}
      okText="Tạo"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên Phòng Ban"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng ban" }]}
        >
          <Input placeholder="Ví dụ: Khối Toán - Lý" />
        </Form.Item>

        <Form.Item
          label="Mã Phòng Ban"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã phòng ban" }]}
        >
          <Input placeholder="Ví dụ: MATH_PHYS" />
        </Form.Item>

        <Form.Item label="Mô Tả" name="description">
          <TextArea rows={4} placeholder="Mô tả về phòng ban..." />
        </Form.Item>

        <Form.Item label="Phòng Ban Cha" name="parent_id">
          <Select placeholder="-- Không có (Cấp cao nhất) --" allowClear>
            {departments.map((dept) => (
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

export default ModalAddDepartment;
