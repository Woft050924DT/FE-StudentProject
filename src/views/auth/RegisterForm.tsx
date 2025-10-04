import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../utils/validation";
import type { RegisterDto } from "../../models/dto/auth.types";
import { AuthService } from "../../services/AuthService";
import { alertError, alertSuccess } from "../../utils/alert";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  type RegisterFormValues = Required<Pick<RegisterDto, 'email' | 'password'>> & {
    firstName: string;
    lastName: string;
  };

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const payload: RegisterDto = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.email, // dùng email làm username mặc định nếu backend yêu cầu
      };
      await AuthService.register(payload);
      await alertSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/auth/login");
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string | string[]; error?: string } }; message?: string } | undefined;
      let message = apiErr?.response?.data?.message || apiErr?.message || "Đăng ký thất bại";
      if (typeof message === 'string' && /username/i.test(message)) {
        message = "Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác.";
      }
      await alertError(typeof message === 'string' ? message : String(message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-center">Đăng ký</h2>
      <p className="text-center text-sm text-gray-600 mb-4">
        Đã có tài khoản?{' '}
        <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
          Đăng nhập
        </Link>
      </p>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">Họ</label>
            <input id="firstName" {...register("firstName")} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500" />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{String(errors.firstName.message)}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">Tên</label>
            <input id="lastName" {...register("lastName")} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500" />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{String(errors.lastName.message)}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email")} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{String(errors.email.message)}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Mật khẩu</label>
            <input id="password" type="password" {...register("password")} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500" />
            {errors.password && <p className="mt-1 text-sm text-red-600">{String(errors.password.message)}</p>}
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md disabled:opacity-50">
          {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
        <div className="text-center text-sm">
          <span className="text-gray-600">Quên mật khẩu? </span>
          <Link to="/auth/forgot-password" className="text-indigo-600 hover:text-indigo-500 font-medium">Khôi phục tại đây</Link>
        </div>
      </form>
      </div>
    </div>
  );
};

export default RegisterForm;
