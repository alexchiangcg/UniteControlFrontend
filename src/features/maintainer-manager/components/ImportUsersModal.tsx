/**
 * ImportUsersModal 元件
 *
 * 批次匯入使用者的檔案上傳對話框
 */

import { useState } from "react";
import { Modal, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useImportUsersMutation } from "../services/userManagementServices";

interface ImportUsersModalProps {
  /** Modal 顯示狀態 */
  visible: boolean;
  /** 關閉回調 */
  onClose: () => void;
  /** 匯入成功回調 */
  onImportSuccess: () => void;
}

/**
 * 批次匯入使用者 Modal 元件
 */
const ImportUsersModal: React.FC<ImportUsersModalProps> = ({
  visible,
  onClose,
  onImportSuccess,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [importUsers, { isLoading }] = useImportUsersMutation();

  /**
   * 檔案上傳前驗證
   */
  const beforeUpload = (file: File) => {
    const isValidType =
      file.type === "text/csv" ||
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".xlsx");

    if (!isValidType) {
      message.error("只能上傳 CSV 或 XLSX 格式的檔案！");
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("檔案大小不能超過 10MB！");
      return false;
    }

    // 阻止自動上傳
    return false;
  };

  /**
   * 檔案列表變更處理
   */
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    // 只保留最後一個檔案
    setFileList(newFileList.slice(-1));
  };

  /**
   * 處理上傳
   */
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("請先選擇檔案");
      return;
    }

    const file = fileList[0].originFileObj;
    if (!file) {
      message.error("檔案讀取失敗");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await importUsers(formData).unwrap();

      // 顯示匯入結果
      if (result.failedCount === 0) {
        message.success(`成功匯入 ${result.successCount} 筆使用者資料`);
      } else {
        Modal.info({
          title: "匯入完成",
          content: (
            <div>
              <p>成功匯入：{result.successCount} 筆</p>
              <p>失敗：{result.failedCount} 筆</p>
              {result.errors && result.errors.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">錯誤詳情：</p>
                  <ul className="list-disc pl-5 max-h-60 overflow-auto">
                    {result.errors.map((error, index) => (
                      <li key={index}>
                        第 {error.row} 行：{error.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ),
        });
      }

      setFileList([]);
      onImportSuccess();
      onClose();
    } catch (error) {
      // 錯誤由 baseQueryWithErrorHandler 統一處理
      console.error("匯入失敗:", error);
    }
  };

  /**
   * 處理取消
   */
  const handleCancel = () => {
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title="Import Users"
      open={visible}
      onOk={handleUpload}
      onCancel={handleCancel}
      okText="Upload"
      cancelText="Cancel"
      confirmLoading={isLoading}
      okButtonProps={{ disabled: fileList.length === 0 }}
    >
      <div className="py-4">
        <Upload.Dragger
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onRemove={() => setFileList([])}
          accept=".csv,.xlsx"
          maxCount={1}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">點擊或拖曳檔案到此區域上傳</p>
          <p className="ant-upload-hint">
            支援 CSV 或 XLSX 格式，檔案大小不超過 10MB
          </p>
        </Upload.Dragger>

        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-gray-600 mb-2">
            <strong>檔案格式說明：</strong>
          </p>
          <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
            <li>第一行為標題行（username, email, notes, password）</li>
            <li>username 與 email 為必填欄位</li>
            <li>password 長度至少 6 個字元</li>
            <li>notes 為選填欄位</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ImportUsersModal;
