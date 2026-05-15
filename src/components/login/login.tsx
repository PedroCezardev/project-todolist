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
  
  // Estados do Formulário
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [profissao, setProfissao] = useState("")

  const router = useRouter();
  const logo = '/PC PRINCIPAL 1.png';

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
      setIsLogin(true);
    } catch (erro: any) {
      alert("Erro ao criar conta: " + erro.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex min-h-[600px]">
        
        <div className="hidden md:flex w-1/2 bg-[#2D2499] relative flex-col items-center justify-center text-white p-12 text-center">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white/10 p-6 rounded-full mb-6 backdrop-blur-sm">
                    <div className="w-24 h-24 relative">
                        <Image
                            src={logo}
                            alt="Logo Essence"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                    {isLogin ? "Bem-vindo de volta!" : "Junte-se a nós!"}
                </h2>
                <p className="text-white/80 max-w-xs leading-relaxed">
                    {isLogin 
                        ? "Gerencie sua produtividade e alcance suas metas diárias com nosso dashboard gamificado."
                        : "Crie sua conta agora e comece a transformar suas tarefas em conquistas."
                    }
                </p>
            </div>

            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#457053] rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          
          <div className="max-w-md mx-auto w-full">
            <div className="text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Acesse sua conta" : "Crie sua conta"}
              </h1>
              <p className="text-gray-500">
                {isLogin 
                    ? "Preencha seus dados para entrar." 
                    : "Preencha os campos abaixo para começar."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Campos exclusivos de Cadastro */}
              {!isLogin && (
                <>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-[#33563f] transition-colors" />
                    <Input
                      type="text"
                      placeholder="Nome Completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-[#33563f] focus:ring-[#33563f] transition-all"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                        <Phone className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-[#33563f] transition-colors" />
                        <Input
                        type="text"
                        placeholder="Telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-[#33563f] focus:ring-[#33563f] transition-all"
                        required
                        />
                    </div>
                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-[#33563f] transition-colors" />
                        <Input
                        type="text"
                        placeholder="Profissão"
                        value={profissao}
                        onChange={(e) => setProfissao(e.target.value)}
                        className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-[#33563f] focus:ring-[#33563f] transition-all"
                        required
                        />
                    </div>
                  </div>
                </>
              )}

              {/* Campos Comuns (Login e Cadastro) */}
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-[#33563f] transition-colors" />
                <Input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-[#33563f] focus:ring-[#33563f] transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-[#33563f] transition-colors" />
                <Input
                  type="password"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-[#33563f] focus:ring-[#33563f] transition-all"
                  required
                />
              </div>

              {/* Link de Esqueci a senha (Só no login) */}
              {isLogin && (
                <div className="text-right">
                    <a href="#" className="text-sm text-gray-500 hover:text-[#33563f] transition-colors font-medium">
                    Esqueceu a senha?
                    </a>
                </div>
              )}

              <Button
                  disabled={loading}
                  type="submit"
                  className="w-full h-12 bg-[#100488] hover:bg-[#2D2499] text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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

            <div className="mt-8 text-center pt-6 border-t border-gray-100">
                <p className="text-gray-600">
                    {isLogin ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 font-bold text-[#2D2499] hover:underline focus:outline-none"
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