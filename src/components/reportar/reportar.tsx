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
    <div className="flex flex-col bg-gray-50 justify-center items-center w-full h-full py-4 px-4 rounded-lg shadow-xl">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg p-8 md:p-12 lg:p-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left side - Information */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">ESTAMOS AQUI PARA AJUDÁ-LO</p>
            <h1 className="text-4xl lg:text-5xl font-normal mb-6 leading-tight">
              <span className="font-bold">Encontrou</span> Algum Problema?
              <br />
            </h1>
            <p className="text-gray-600 mb-12 leading-relaxed">
              Encontrou um bug, um erro ou algum comportamento inesperado no sistema? Descreva seu problema em detalhes e nossa equipe de suporte irá analisá-lo o mais rápido possível para que você possa voltar ao trabalho.
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#4B3CFF] rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">E-mail</p>
                  <p className="text-lg font-medium">pcdasilvab***@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#4B3CFF] rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Número</p>
                  <p className="text-lg font-medium">(81) 98596-4761</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ana Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border-gray-200"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ana.silva@spaclinic.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-gray-200"
                />
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Solicitação
                </label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger className="bg-white border-gray-200">
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
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Descreva o Problema
                </label>
                <Textarea
                  id="message"
                  placeholder="Digite sua mensagem"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white border-gray-200 min-h-[120px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#2D2499] hover:bg-[#4B3CFF] text-white rounded-full py-6 text-base font-medium"
              >
                Enviar Relatório
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
