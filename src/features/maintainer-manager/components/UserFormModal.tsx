/**
 * UserFormModal 元件
 *
 * 建立/編輯使用者的表單對話框
 */

import { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '../services/userManagementServices';
import type { User, UserFormValues } from '../types/user.types';

interface UserFormModalProps {
  /** Modal 顯示狀態 */
  visible: boolean;
  /** 模式：建立或編輯 */
  mode: 'create' | 'edit';
  /** 初始值（編輯模式使用） */
  initialValues?: User;
  /** 關閉回調 */
  onClose: () => void;
  /** 提交成功回調 */
  onSubmitSuccess: () => void;
}

/**
 * 使用者表單 Modal 元件
 */
const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  mode,
  initialValues,
  onClose,
  onSubmitSuccess,
}) => {
  const [form] = Form.useForm<UserFormValues>();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isLoading = isCreating || isUpdating;

  /**
   * 當 Modal 開啟或初始值變更時，更新表單
   */
  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialValues) {
        form.setFieldsValue({
          username: initialValues.username,
          email: initialValues.email,
          notes: initialValues.notes,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, mode, initialValues, form]);

  /**
   * 處理表單提交
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (mode === 'create') {
        await createUser(values).unwrap();
        message.success('使用者建立成功');
      } else if (mode === 'edit' && initialValues) {
        await updateUser({ id: initialValues.id, ...values }).unwrap();
        message.success('使用者更新成功');
      }

      form.resetFields();
      onSubmitSuccess();
      onClose();
    } catch (error: any) {
      // 表單驗證錯誤會自動顯示
      // API 錯誤由 baseQueryWithErrorHandler 統一處理
      if (error?.errorFields) {
        console.log('表單驗證錯誤:', error);
      } else {
        console.error('提交失敗:', error);
      }
    }
  };

  /**
   * 處理取消
   */
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={mode === 'create' ? 'Create User' : 'Edit User'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={mode === 'create' ? 'Create' : 'Save'}
      cancelText="Cancel"
      confirmLoading={isLoading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        className="mt-4"
      >
        {/* 使用者名稱 */}
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Please input username!' },
            { min: 3, message: 'Username must be at least 3 characters' },
          ]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        {/* 電子郵件 */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please input valid email!' },
          ]}
        >
          <Input placeholder="Enter email" type="email" />
        </Form.Item>

        {/* 備註 */}
        <Form.Item
          label="Notes"
          name="notes"
        >
          <Input.TextArea
            placeholder="Enter notes (optional)"
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* 密碼（僅建立模式顯示） */}
        {mode === 'create' && (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input password!' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserFormModal;