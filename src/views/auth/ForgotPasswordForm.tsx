import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../../utils/validation";
import { AuthService } from "../../services/AuthService";
import { alertError, alertSuccess } from "../../utils/alert";
import { Link } from "react-router-dom";

type ForgotForm = { email: string };

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    try {
      await AuthService.forgotPassword({ email: data.email } as any);
      await alertSuccess("Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Không thể gửi yêu cầu";
      await alertError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-center">Quên mật khẩu</h2>
        <p className="text-center text-sm text-gray-600">Nhập email để nhận liên kết đặt lại mật khẩu.</p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input id="email" type="email" {...register("email")} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{String(errors.email.message)}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md disabled:opacity-50">
            {isLoading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </button>
        </form>
        <div className="text-center text-sm">
          <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;


