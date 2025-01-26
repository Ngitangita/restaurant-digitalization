import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { axiosConf } from "../../services/api";
import { useAuthStore } from "../../stores/useAuthStore.js";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast.jsx";

const LoginSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  password: z.string().min(4, { message: "Le mot de passe est incorrecte" }),
});

const SignupSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  password: z.string().min(4, { message: "Le mot de passe doit comporter au moins 4 caractères" }),
  confirmePassword: z.string().min(4, { message: "Le mot de passe doit comporter au moins 4 caractères" }),
}).refine((data) => data.password === data.confirmePassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmePassword"],
});

export default function Authentication() {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [type, setType] = useState("userIconSingin");
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast()

  const {
    register: loginRegister,
    handleSubmit: loginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
  });

  const {
    register: signupRegister,
    handleSubmit: signupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm({
    resolver: zodResolver(SignupSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(-1);
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosConf.post("/sign-in", {
        email: data.email,
        password: data.password,
      });
      if (response?.status >= 200 && response.status < 300 && response.data) {
        setIsAuthenticated(true);
        showSuccess("Connexion réussie ! Bienvenue.");
        navigate("/");
      }
    } catch (error) {
      console.error("Échec de la connexion :", error);
      showError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
    }
    setIsLoading(false);
    resetLogin();
  };

  const handleSignup = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosConf.post("/sign-up", {
        username: data.name,
        email: data.email,
        password: data.password,
      });
      if (response?.status >= 200 && response.status < 300 && response.data) {
        setIsAuthenticated(true);
        navigate("/");
        showSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        if (error.response.data.message.includes("email")) {
          setSignupError("Cet e-mail est déjà utilisé. Veuillez utiliser un e-mail différent.");
          showError("E-mail déjà utilisé.");
        } else if (error.response.data.message.includes("username")) {
          setSignupError("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");
          showError("Nom d'utilisateur déjà pris.");
        }
      } else {
        console.error("Échec de l'inscription :", error);
        showError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      }
    }
    setIsLoading(false);
    resetSignup();
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="overflow-hidden LoginbgImg h-screen w-screen">
      <div className="bg-black/80 h-screen flex flex-col justify-center items-center p-4 md:p-8 lg:p-16">
        <div className="w-full max-w-md p-5 bg-gradient-to-l from-black/85 to-gray-300/20 rounded-lg">
          <div className="text-center py-2 text-gray-900">
            <div className="mb-4 flex flex-col justify-center items-center py-2">
              <img src="../public/UTOPIA-B.png" alt="UTOPIA-B" className="w-20 h-20 rounded-full" />
              {type === "userIconSingin" ? (
                <span className="text-2xl font-bold text-white">Connectez-vous à SOOATEL</span>
              ) : (
                <span className="text-2xl font-bold text-white">Créez un nouveau compte</span>
              )}
            </div>
          </div>

          <div className="flex justify-around">
            <button
              className={`px-4 py-2 rounded-lg ${type === "userIconSingin" ? "bg-gradient-to-r from-gray-800 to-gray-300/80 text-white" : "bg-gray-200"}`}
              onClick={() => setType("userIconSingin")}
            >
              Connexion
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${type === "userIconSingUp" ? "bg-gradient-to-l from-gray-800 to-gray-300/80 text-white" : "bg-gray-200"}`}
              onClick={() => setType("userIconSingUp")}
            >
              Inscription
            </button>
          </div>

          {isLoading ? ( 
            <div className="flex justify-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-middle"
                role="status"
              >
                <span className="sr-only">Chargement...</span>
              </div>
            </div>
          ) : (
            <>
              {type === "userIconSingin" ? (
                <form onSubmit={loginSubmit(handleLogin)} className="flex flex-col gap-4 text-white">
                  <FormField
                    label="Votre e-mail"
                    type="email"
                    placeholder="nom@mail.com"
                    register={loginRegister}
                    errors={loginErrors}
                    name="email"
                  />
                  <PasswordInput
                    showPassword={showLoginPassword}
                    toggleShowPassword={() => setShowLoginPassword(!showLoginPassword)}
                    register={loginRegister}
                    name="password"
                    errors={loginErrors}
                  />
                  <button
                    type="submit"
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-gray-300/80 text-white rounded-lg"
                  >
                    Connexion
                  </button>
                  <span className="text-white w-36 hover:text-blue-500">
                    <a href="#" className="text-sm font-medium">
                      Mot de passe oublié ?
                    </a>
                  </span>
                </form>
              ) : (
                <form onSubmit={signupSubmit(handleSignup)} className="flex flex-col text-white">
                  <FormField
                    label="Votre nom"
                    type="text"
                    placeholder="votre nom"
                    register={signupRegister}
                    errors={signupErrors}
                    name="name"
                  />
                  <FormField
                    label="Votre e-mail"
                    type="email"
                    placeholder="nom@mail.com"
                    register={signupRegister}
                    errors={signupErrors}
                    name="email"
                  />
                  <PasswordInput
                    showPassword={showSignupPassword}
                    toggleShowPassword={() => setShowSignupPassword(!showSignupPassword)}
                    register={signupRegister}
                    name="password"
                    errors={signupErrors}
                  />
                  <PasswordInput
                    showPassword={showConfirmPassword}
                    toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    register={signupRegister}
                    name="confirmePassword"
                      placeholder="Confirmez votre mot de passe"
                     label="Confirmer le mot de passe"
                    errors={signupErrors}
                  />
                  <button
                    type="submit"
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-gray-300/80 text-white rounded-lg"
                  >
                    Inscription
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, type, placeholder, register, errors, name }) {
  return (
    <>
      <label className="text-lg font-semibold text-white">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-gray-800/50 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-blue-500"
      />
      {errors[name] && (
        <p className="text-sm text-red-400">{errors[name]?.message}</p>
      )}
    </>
  );
}

function PasswordInput({ showPassword, toggleShowPassword, register,placeholder = 'Votre mot de passe', name, errors, label = 'Mot de passe' }) {
  return (
    <>
      <label className="text-lg font-semibold text-white">{label}</label>
      <div className="relative">
        <input
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-gray-800/50 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <div
          className="absolute top-3 right-4 cursor-pointer"
          onClick={toggleShowPassword}
        >
          {showPassword ? <FaRegEyeSlash className="text-white" /> : <FaRegEye className="text-white" />}
        </div>
      </div>
      {errors[name] && <p className="text-sm text-red-400">{errors[name]?.message}</p>}
    </>
  );
}
