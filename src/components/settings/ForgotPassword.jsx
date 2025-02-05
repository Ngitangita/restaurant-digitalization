import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const emailSchema = z.object({
  email: z.string().email("Email invalide"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "Le code OTP doit contenir 6 chiffres"),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({ resolver: zodResolver(emailSchema) });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({ resolver: zodResolver(otpSchema) });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const sendOtp = async (data) => {
    setEmail(data.email);

    const payload = { email: data.email };
    console.log(payload);
  };

  const verifyOtp = async (data) => {
    console.log(data);
  };

  const resetPassword = async (data) => {
    console.log(data);
  };

  return (
    <div className="overflow-hidden LoginbgImg h-screen w-screen">
    <div className="bg-black/80 h-screen flex flex-col justify-center items-center p-4 md:p-8 lg:p-16">
      <div className="w-full max-w-md p-5 bg-gradient-to-l from-black/85 to-gray-300/20 rounded-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-4">
            {step === 1 && "Mot de passe oublié"}
            {step === 2 && "Vérification OTP"}
            {step === 3 && "Réinitialisation"}
          </h2>

          {step === 1 && (
            <form
              onSubmit={handleEmailSubmit(sendOtp)}
              className="flex flex-col"
            >
              <InputField
                label="Votre Email"
                type="email"
                placeholder="nom@mail.com"
                register={registerEmail}
                errors={emailErrors}
                name="email"
              />
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 rounded"
              >
                Envoyer OTP
              </button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={handleOtpSubmit(verifyOtp)}
              className="flex flex-col"
            >
              <InputField
                label="Code OTP"
                type="text"
                placeholder="123456"
                register={registerOtp}
                errors={otpErrors}
                name="otp"
              />
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 rounded"
              >
                Vérifier OTP
              </button>
            </form>
          )}

          {step === 3 && (
            <form
              onSubmit={handlePasswordSubmit(resetPassword)}
              className="flex flex-col text-white"
            >
              <InputField
                label="Nouveau mot de passe"
                type="password"
                placeholder="•••••••"
                register={registerPassword}
                errors={passwordErrors}
                name="password"
              />
              <InputField
                label="Confirmer le mot de passe"
                type="password"
                placeholder="•••••••"
                register={registerPassword}
                errors={passwordErrors}
                name="confirmPassword"
              />
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 rounded"
              >
                Réinitialiser
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, type, placeholder, register, errors, name }) {
  return (
    <>
      <label className="text-white mb-1">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded border bg-gray-700 text-white focus:border-blue-500"
      />
      {errors[name] && (
        <p className="text-red-400 text-sm">{errors[name].message}</p>
      )}
    </>
  );
}
