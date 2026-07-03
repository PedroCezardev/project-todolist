"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, ArrowRight } from "lucide-react"

export function Reportar() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    industry: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
  }

  return (
    <div className="w-full h-full bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg shadow-xl overflow-y-auto flex flex-col">
      <div className="w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl shadow-lg p-5 sm:p-8 md:p-10 lg:p-12 my-auto mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Left side - Information */}
          <div className="flex flex-col justify-center">
            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2 sm:mb-4">ESTAMOS AQUI PARA AJUDÁ-LO</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal mb-4 sm:mb-6 leading-tight">
              <span className="font-bold">Encontrou</span> Algum Problema?
              <br />
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-10 leading-relaxed">
              Encontrou um bug, um erro ou algum comportamento inesperado no sistema? Descreva seu problema em detalhes e nossa equipe de suporte irá analisá-lo o mais rápido possível para que você possa voltar ao trabalho.
            </p>

            <div className="space-y-4 sm:space-y-6">
              {/* Email */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#006EFF] rounded-lg flex items-center justify-center shadow-md">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-0.5">E-mail</p>
                  <p className="text-base sm:text-lg font-medium text-slate-800">pcdasilvab***@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#006EFF] rounded-lg flex items-center justify-center shadow-md">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-0.5">Número</p>
                  <p className="text-base sm:text-lg font-medium text-slate-800">(81) 98596-4761</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-100 shadow-inner">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Nome
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ana Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border-gray-200 h-10 sm:h-11 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ana.silva@spaclinic.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-gray-200 h-10 sm:h-11 text-sm"
                />
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="industry" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Tipo de Solicitação
                </label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger className="bg-white border-gray-200 h-10 sm:h-11 text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pharmaceutical">Reportar um Bug/Erro</SelectItem>
                    <SelectItem value="manufacturing">Sugestão de Melhoria</SelectItem>
                    <SelectItem value="agriculture">Dúvida Geral</SelectItem>
                    <SelectItem value="research">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Descreva o Problema
                </label>
                <Textarea
                  id="message"
                  placeholder="Digite sua mensagem"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white border-gray-200 min-h-[100px] sm:min-h-[120px] resize-none text-sm"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#002759] hover:bg-[#006EFF] text-white rounded-full py-5 sm:py-6 text-sm sm:text-base font-medium transition-all duration-300 shadow-md"
              >
                Enviar Relatório
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
