"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Eye, EyeOff, Loader2 } from "lucide-react"

import { getCurrentUser, updateUserProfile } from "@/services/authService"

export default function ProfileComponent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    password: "********",
    avatar: "",
  })

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setProfileData({
            name: user.get("name") || user.get("username") || "",
            email: user.get("email") || "",
            phone: user.get("telefone") || "",
            profession: user.get("profissao") || "",
            password: "********",
            avatar: "/professional-woman-spa-therapist.jpg",
        })
      }
      setLoading(false);
    }
    loadUser();
  }, [])

  // Visualização da imagem local (Preview)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
        await updateUserProfile({
            name: profileData.name,
            telefone: profileData.phone,
            profissao: profileData.profession,
            password: profileData.password
        });
        alert("Perfil atualizado com sucesso!");
    } catch (error: any) {
        alert("Erro ao atualizar: " + error.message);
    } finally {
        setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando perfil...</div>
  }

  return (
    <div className="w-full h-full bg-gray-50 p-3 sm:p-4 md:p-6 flex flex-col rounded-lg shadow-xl overflow-y-auto">
      <Card className="w-full max-w-4xl bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 my-auto mx-auto">
        <CardHeader className="border-b bg-white pb-4 sm:pb-6 mb-4 sm:mb-6">
          <CardTitle className="text-xl sm:text-2xl font-bold">Perfil do Usuário</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Gerencie suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-4xl bg-blue-100 text-blue-600">
                    {profileData.name ? profileData.name[0] : "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-2 right-2 bg-[#006EFF] text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{profileData.name}</h3>
                <p className="text-sm text-gray-500">{profileData.profession || "Sem profissão definida"}</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email (Não editável)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Profissão */}
                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-sm font-medium text-gray-700">
                    Profissão
                  </Label>
                  <Input
                    id="profession"
                    value={profileData.profession}
                    onChange={(e) => setProfileData({ ...profileData, profession: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Senha */}
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Alterar Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={profileData.password}
                      onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                      className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Mantenha "********" para não alterar a senha.</p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#002759] hover:bg-[#006EFF] text-white px-8 py-2 rounded-full shadow-md transition-all hover:shadow-lg text-sm sm:text-base"
                >
                  {saving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                    </>
                  ) : (
                    <>
                        <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}