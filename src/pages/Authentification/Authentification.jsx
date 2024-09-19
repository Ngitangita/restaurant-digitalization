import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { setUp } from "../../axios/axios";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const LoginSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit comporter au moins 8 caractères" }),
});

const SignupSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit comporter au moins 8 caractères" }),
  confirmePassword: z.string().min(8, { message: "Le mot de passe doit comporter au moins 8 caractères" }),
}).refine((data) => data.password === data.confirmePassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmePassword"],
});

export default function Authentification({ onAuth }) {
  const [type, setType] = useState("userIconSingin");
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // État pour le loader
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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

  const handleLogin = async (data) => {
    setIsLoading(true); // Affiche le loader
    try {
      const response = await setUp().post("/sign-in", {
        email: data.email,
        password: data.password,
      });
      onAuth(response.data);
      navigate("/"); // Redirection après succès
    } catch (error) {
      console.error("Échec de la connexion :", error);
    }
    setIsLoading(false); // Masque le loader
    resetLogin();
  };

  const handleSignup = async (data) => {
    setIsLoading(true); // Affiche le loader
    try {
      const response = await setUp().post("/sign-up", {
        username: data.name,
        email: data.email,
        password: data.password,
      });
      onAuth(response.data);
      navigate("/"); // Redirection après succès
    } catch (error) {
      if (error.response && error.response.status === 409) {
        if (error.response.data.message.includes("email")) {
          setSignupError("Cet e-mail est déjà utilisé. Veuillez utiliser un e-mail différent.");
        } else if (error.response.data.message.includes("username")) {
          setSignupError("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");
        }
      } else {
        console.error("Échec de l'inscription :", error);
      }
    }
    setIsLoading(false); // Masque le loader
    resetSignup();
  };

  return (
    <div className="overflow-hidden LoginbgImg h-screen">
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

          <div className="flex justify-around mb-4">
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

          {isLoading ? ( // Affiche le loader pendant le traitement
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
                  <div className="w-full flex flex-col gap-2 items-start">
                    <label className="text-[13px] w-40">Votre e-mail</label>
                    <input
                      type="email"
                      placeholder="nom@mail.com"
                      className="w-full px-4 py-2 border border-black/25 rounded-lg bg-white/5 outline-none text-white"
                      {...loginRegister("email")}
                    />
                    {loginErrors.email && <span className="text-red-500 text-[13px]">{loginErrors.email.message}</span>}
                  </div>

                  <div className="w-full flex flex-col gap-2 items-start relative">
                    <label className="text-[13px] w-40">Mot de passe</label>
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="********"
                      className="w-full px-4 py-2 border border-black/25 rounded-lg bg-white/5 text-white outline-none"
                      {...loginRegister("password")}
                    />
                    {loginErrors.password && <span className="text-red-500 text-[13px]">{loginErrors.password.message}</span>}

                    <button
                      type="button"
                      className="absolute right-2 top-10 text-white"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                    >
                      {showLoginPassword ? (
                        <FaRegEyeSlash />
                      ) : (
                        <FaRegEye />
                      )}
                    </button>
                  </div>

                  <button type="submit" className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-gray-300/80 text-white rounded-lg">
                    Connexion
                  </button>
                  <span className="text-white w-36 hover:text-blue-500">
                    <a href="#" className="text-sm font-medium">
                      Mot de passe oublié ?
                    </a>
                  </span>

                </form>
              ) : (
                <form onSubmit={signupSubmit(handleSignup)} className="flex flex-col gap-4 text-white">
                  <div className="flex flex-row gap-2 items-start">
                    <label className="text-[13px] w-40">Votre nom</label>
                    <div className="w-full flex flex-col gap-2 items-start">
                      <input
                        type="text"
                        placeholder="votre nom"
                        className="w-full bg-white/10 px-4 py-2 border border-black/25 rounded-lg outline-none text-white"
                        {...signupRegister("name")}
                      />
                      {signupErrors.name && <span className="text-red-500 text-[13px]">{signupErrors.name.message}</span>}
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 items-start">
                    <label className="text-[13px] w-40">Votre e-mail</label>
                    <div className="w-full flex flex-col gap-2 items-start">
                      <input
                        type="email"
                        placeholder="nom@mail.com"
                        className="w-full bg-white/10 px-4 py-2 border border-black/25 rounded-lg outline-none text-white"
                        {...signupRegister("email")}
                      />
                      {signupErrors.email && <span className="text-red-500 text-[13px]">{signupErrors.email.message}</span>}
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 items-start relative">
                    <label className="text-[13px] w-40">Mot de passe</label>
                    <div className="w-full flex flex-col gap-2 items-start relative">
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="********"
                        className="w-full bg-white/10 px-4 py-2 border border-black/25 rounded-lg outline-none text-white"
                        {...signupRegister("password")}
                      />
                      {signupErrors.password && <span className="text-red-500 text-[13px]">{signupErrors.password.message}</span>}

                      <button
                        type="button"
                        className="absolute right-2 top-4 text-white"
                        onClick={() => setShowSignupPassword((prev) => !prev)}
                      >
                        {showSignupPassword ? (
                          <FaRegEyeSlash />
                        ) : (
                          <FaRegEye />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 items-start relative">
                    <label className="text-[13px] w-40">Confirmer le mot de passe</label>
                    <div className="w-full flex flex-col gap-2 items-start relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        className="w-full bg-white/10 px-4 py-2 border border-black/25 rounded-lg outline-none text-white"
                        {...signupRegister("confirmePassword")}
                      />
                      {signupErrors.confirmePassword && <span className="text-red-500 text-[13px]">{signupErrors.confirmePassword.message}</span>}

                      <button
                        type="button"
                        className="absolute right-2 top-4 text-white"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <FaRegEyeSlash />
                        ) : (
                          <FaRegEye />
                        )}
                      </button>
                    </div>
                  </div>

                  {signupError && <span className="text-red-500 text-[13px]">{signupError}</span>}

                  <button type="submit" className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-gray-300/80 text-white rounded-lg">
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
