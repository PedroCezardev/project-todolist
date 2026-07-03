"use client"

import React, { useState } from "react"
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Lock, Phone, Briefcase, Mail, Loader2, ArrowRight } from "lucide-react"
import { signIn, signUp } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Estados do Formulário
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [profissao, setProfissao] = useState("")

  const router = useRouter();
  const logo = '/ICON-TAREFEX-PADRAO.png';

  const toggleMode = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      await handleLogin();
    } else {
      await handleCadastro();
    }
    
    setLoading(false);
  }

  const handleLogin = async () => {
    try {
      await signIn({ email, password });
      router.push('/'); 
    } catch (erro: any) {
      alert("Erro no login: " + erro.message);
    }
  };

  const handleCadastro = async () => {
    try {
      await signUp({ 
        email, 
        password, 
        username: nome,
        telefone,
        profissao
      });
      
      alert("Conta criada com sucesso! Você já pode entrar.");
      toggleMode();
    } catch (erro: any) {
      alert("Erro ao criar conta: " + erro.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-3 sm:p-4 md:p-6">
      
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row min-h-[550px] md:min-h-[600px] transition-all duration-300">
        
        {/* Painel Azul (Topo no Mobile / Esquerda no Desktop) */}
        <div className="flex w-full md:w-1/2 bg-gradient-to-br from-[#002759] to-[#006EFF] relative flex-col items-center justify-center text-white p-6 sm:p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className={`relative z-10 flex flex-col items-center transition-all duration-300 transform ${
              isAnimating ? "opacity-0 scale-95 -translate-y-4" : "opacity-100 scale-100 translate-y-0"
            }`}>
                <div className="bg-white/10 p-4 sm:p-6 rounded-full mb-4 sm:mb-6 backdrop-blur-sm shadow-inner">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
                        <Image
                            src={logo}
                            alt="Logo Tarefex"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">
                    {isLogin ? "Bem-vindo de volta!" : "Junte-se a nós!"}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-xs leading-relaxed sm:leading-relaxed">
                    {isLogin 
                        ? "Gerencie sua produtividade e alcance suas metas diárias com nosso dashboard gamificado."
                        : "Crie sua conta agora e comece a transformar suas tarefas em conquistas."
                    }
                </p>
            </div>

            <div className="absolute -bottom-24 -left-24 w-60 sm:w-80 h-60 sm:h-80 bg-[#006EFF] rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -top-24 -right-24 w-60 sm:w-80 h-60 sm:h-80 bg-[#002759] rounded-full blur-3xl opacity-50"></div>
        </div>

        {/* Formulário (Embaixo no Mobile / Direita no Desktop) */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center relative">
          
          <div className="max-w-md mx-auto w-full">
            <div className={`transition-all duration-300 transform ${
              isAnimating ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"
            }`}>
              <div className="text-left mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {isLogin ? "Acesse sua conta" : "Crie sua conta"}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-500">
                  {isLogin 
                      ? "Preencha seus dados para entrar." 
                      : "Preencha os campos abaixo para começar."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                
                {/* Campos exclusivos de Cadastro */}
                {!isLogin && (
                  <>
                    <div className="relative group">
                      <User className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#006EFF] transition-colors" />
                      <Input
                        type="text"
                        placeholder="Nome Completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="pl-10 sm:pl-12 h-11 md:h-12 text-sm sm:text-base bg-gray-50 border-gray-200 focus:border-[#006EFF] focus:ring-[#006EFF] transition-all"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="relative group">
                          <Phone className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#006EFF] transition-colors" />
                          <Input
                          type="text"
                          placeholder="Telefone"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          className="pl-10 sm:pl-12 h-11 md:h-12 text-sm sm:text-base bg-gray-50 border-gray-200 focus:border-[#006EFF] focus:ring-[#006EFF] transition-all"
                          required
                          />
                      </div>
                      <div className="relative group">
                          <Briefcase className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#006EFF] transition-colors" />
                          <Input
                          type="text"
                          placeholder="Profissão"
                          value={profissao}
                          onChange={(e) => setProfissao(e.target.value)}
                          className="pl-10 sm:pl-12 h-11 md:h-12 text-sm sm:text-base bg-gray-50 border-gray-200 focus:border-[#006EFF] focus:ring-[#006EFF] transition-all"
                          required
                          />
                      </div>
                    </div>
                  </>
                )}

                {/* Campos Comuns (Login e Cadastro) */}
                <div className="relative group">
                  <Mail className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#006EFF] transition-colors" />
                  <Input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 sm:pl-12 h-11 md:h-12 text-sm sm:text-base bg-gray-50 border-gray-200 focus:border-[#006EFF] focus:ring-[#006EFF] transition-all"
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#006EFF] transition-colors" />
                  <Input
                    type="password"
                    placeholder="Sua senha secreta"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 sm:pl-12 h-11 md:h-12 text-sm sm:text-base bg-gray-50 border-gray-200 focus:border-[#006EFF] focus:ring-[#006EFF] transition-all"
                    required
                  />
                </div>

                {/* Link de Esqueci a senha (Só no login) */}
                {isLogin && (
                  <div className="text-right">
                      <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-[#006EFF] transition-colors font-medium">
                      Esqueceu a senha?
                      </a>
                  </div>
                )}

                <Button
                    disabled={loading}
                    type="submit"
                    className="w-full h-11 md:h-12 bg-[#002759] hover:bg-[#006EFF] text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                          {isLogin ? "Entrar na Plataforma" : "Criar Conta Grátis"} 
                          {!loading && <ArrowRight className="ml-2 h-5 w-5 opacity-80" />}
                      </>
                    )}
                </Button>
              </form>
            </div>

            <div className="mt-6 sm:mt-8 text-center pt-4 sm:pt-6 border-t border-gray-100 text-xs sm:text-sm">
                <p className="text-gray-600">
                    {isLogin ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
                    <button 
                        type="button"
                        disabled={isAnimating}
                        onClick={toggleMode}
                        className="ml-2 font-bold text-[#006EFF] hover:text-[#002759] hover:underline focus:outline-none transition-colors disabled:opacity-50"
                    >
                        {isLogin ? "Cadastre-se" : "Fazer Login"}
                    </button>
                </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}