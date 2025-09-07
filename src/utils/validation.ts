// src/utils/validation.ts
import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(50, 'Tên đăng nhập không được quá 50 ký tự')
    .required('Tên đăng nhập là bắt buộc'),
  password: yup
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .required('Mật khẩu là bắt buộc'),
});

export const registerSchema = yup.object({
  firstName: yup
    .string()
    .max(50, 'Họ không được quá 50 ký tự')
    .required('Họ là bắt buộc'),
  lastName: yup
    .string()
    .max(50, 'Tên không được quá 50 ký tự')
    .required('Tên là bắt buộc'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    )
    .required('Mật khẩu là bắt buộc'),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    )
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

export const changePasswordSchema = yup.object({
  oldPassword: yup
    .string()
    .required('Mật khẩu cũ là bắt buộc'),
  newPassword: yup
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu mới không được quá 50 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    )
    .required('Mật khẩu mới là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});