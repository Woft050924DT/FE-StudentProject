import Swal, { type SweetAlertIcon } from "sweetalert2";

type AlertOptions = {
  title?: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
};

export const alertSuccess = async (text: string, title = "Thành công") => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: "OK",
  });
};

export const alertError = async (text: string, title = "Thất bại") => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: "OK",
  });
};

export const alertInfo = async (text: string, title = "Thông báo") => {
  return Swal.fire({
    title,
    text,
    icon: "info",
    confirmButtonText: "OK",
  });
};

export const alertWarning = async (text: string, title = "Cảnh báo") => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    confirmButtonText: "OK",
  });
};

export const confirmAlert = async ({
  title = "Xác nhận",
  text,
  confirmButtonText = "Đồng ý",
  cancelButtonText = "Hủy",
}: AlertOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: "question" as SweetAlertIcon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });
  return result.isConfirmed === true;
};
