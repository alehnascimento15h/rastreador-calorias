'use client';

import { useState } from 'react';
import { UserProfile, Goal, WorkoutsPerWeek, WeightGoal } from '@/lib/types';
import { calculateDailyCalorieGoal } from '@/lib/calories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Target, Activity, TrendingDown, TrendingUp, Minus, Dumbbell, Zap, CheckCircle2, XCircle, Heart, Star, Quote } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const testimonials = [
  {
    name: 'Maria Silva',
    age: 32,
    weightLost: 15,
    time: '4 meses',
    text: 'Perdi 15kg em 4 meses! O BR AI me ajudou a entender minha alimentação e criar hábitos saudáveis. Nunca me senti tão bem!',
    rating: 5
  },
  {
    name: 'João Santos',
    age: 28,
    weightLost: 22,
    time: '6 meses',
    text: 'Incrível! Eliminei 22kg e ganhei muita disposição. O app é simples e funciona de verdade. Recomendo muito!',
    rating: 5
  },
  {
    name: 'Ana Costa',
    age: 35,
    weightLost: 18,
    time: '5 meses',
    text: 'Depois de tentar vários apps, finalmente encontrei o BR AI. Perdi 18kg e me sinto mais confiante e saudável!',
    rating: 5
  }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male' as 'male' | 'female' | 'other',
    goal: 'lose' as Goal,
    targetWeight: '',
    activityLevel: 'moderate' as UserProfile['activityLevel'],
    workoutsPerWeek: '3-5' as WorkoutsPerWeek,
    weightGoal: 'lose_moderate' as WeightGoal,
    hasUsedCalorieApps: false,
    previousApps: [] as string[],
    barriers: [] as string[],
    aspirations: [] as string[],
  });

  const handleNext = () => {
    if (step < 9) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const profile: UserProfile = {
      name: formData.name,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      gender: formData.gender,
      goal: formData.goal,
      targetWeight: parseFloat(formData.targetWeight),
      activityLevel: formData.activityLevel,
      dailyCalorieGoal: 0,
      workoutsPerWeek: formData.workoutsPerWeek,
      weightGoal: formData.weightGoal,
      hasUsedCalorieApps: formData.hasUsedCalorieApps,
      previousApps: formData.previousApps,
      subscriptionStatus: 'trial',
      trialStartDate: new Date().toISOString(),
    };
    
    profile.dailyCalorieGoal = calculateDailyCalorieGoal(profile);
    onComplete(profile);
  };

  const togglePreviousApp = (app: string) => {
    if (formData.previousApps.includes(app)) {
      setFormData({
        ...formData,
        previousApps: formData.previousApps.filter(a => a !== app)
      });
    } else {
      setFormData({
        ...formData,
        previousApps: [...formData.previousApps, app]
      });
    }
  };

  const toggleBarrier = (barrier: string) => {
    if (formData.barriers.includes(barrier)) {
      setFormData({
        ...formData,
        barriers: formData.barriers.filter(b => b !== barrier)
      });
    } else {
      setFormData({
        ...formData,
        barriers: [...formData.barriers, barrier]
      });
    }
  };

  const toggleAspiration = (aspiration: string) => {
    if (formData.aspirations.includes(aspiration)) {
      setFormData({
        ...formData,
        aspirations: formData.aspirations.filter(a => a !== aspiration)
      });
    } else {
      setFormData({
        ...formData,
        aspirations: [...formData.aspirations, aspiration]
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">BR AI</h1>
          <p className="text-gray-400">Rastreador de Calorias</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full mx-0.5 transition-all ${
                  s <= step ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-400">Passo {step} de 9</p>
        </div>

        {/* Step Content */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Informações Básicas</h2>
              </div>
              
              <div>
                <Label htmlFor="name" className="text-gray-300">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black border-gray-700 text-white mt-1"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-gray-300">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="bg-black border-gray-700 text-white mt-1"
                  placeholder="25"
                />
              </div>

              <div>
                <Label className="text-gray-300">Gênero</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[
                    { value: 'male', label: 'Masculino' },
                    { value: 'female', label: 'Feminino' },
                    { value: 'other', label: 'Outro' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, gender: option.value as any })}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.gender === option.value
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-black border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Medidas Corporais</h2>
              </div>

              <div>
                <Label htmlFor="weight" className="text-gray-300">Peso Atual (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="bg-black border-gray-700 text-white mt-1"
                  placeholder="70.0"
                />
              </div>

              <div>
                <Label htmlFor="height" className="text-gray-300">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="bg-black border-gray-700 text-white mt-1"
                  placeholder="170"
                />
              </div>

              <div>
                <Label htmlFor="targetWeight" className="text-gray-300">Peso Desejado (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                  className="bg-black border-gray-700 text-white mt-1"
                  placeholder="65.0"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-pink-400" />
                <h2 className="text-xl font-bold text-white">Seu Objetivo</h2>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Qual é a sua meta de peso?
              </p>

              <div className="space-y-2">
                {[
                  { value: 'lose', label: 'Perder Peso', icon: TrendingDown, color: 'orange' },
                  { value: 'maintain', label: 'Manter Peso', icon: Minus, color: 'blue' },
                  { value: 'gain', label: 'Ganhar Peso', icon: TrendingUp, color: 'green' },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, goal: option.value as Goal })}
                      className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 ${
                        formData.goal === option.value
                          ? `bg-${option.color}-500/20 border-${option.color}-500 text-white`
                          : 'bg-black border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${formData.goal === option.value ? `text-${option.color}-400` : 'text-gray-500'}`} />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-400" />
                <h2 className="text-xl font-bold text-white">O que está impedindo você?</h2>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Selecione os principais obstáculos (pode escolher mais de um):
              </p>

              <div className="space-y-2">
                {[
                  'Falta de consistência',
                  'Hábitos alimentares não saudáveis',
                  'Falta de apoio',
                  'Agenda lotada',
                  'Falta de inspiração para refeições'
                ].map((barrier) => (
                  <button
                    key={barrier}
                    onClick={() => toggleBarrier(barrier)}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      formData.barriers.includes(barrier)
                        ? 'bg-red-500/20 border-red-500 text-white'
                        : 'bg-black border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.barriers.includes(barrier)
                          ? 'bg-red-500 border-red-500'
                          : 'border-gray-600'
                      }`}>
                        {formData.barriers.includes(barrier) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{barrier}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-pink-400" />
                <h2 className="text-xl font-bold text-white">O que você gostaria de alcançar?</h2>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Selecione suas aspirações (pode escolher mais de uma):
              </p>

              <div className="space-y-2">
                {[
                  'Comer e viver de forma mais saudável',
                  'Aumentar minha energia e meu humor',
                  'Sentir-me melhor com meu corpo'
                ].map((aspiration) => (
                  <button
                    key={aspiration}
                    onClick={() => toggleAspiration(aspiration)}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      formData.aspirations.includes(aspiration)
                        ? 'bg-pink-500/20 border-pink-500 text-white'
                        : 'bg-black border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.aspirations.includes(aspiration)
                          ? 'bg-pink-500 border-pink-500'
                          : 'border-gray-600'
                      }`}>
                        {formData.aspirations.includes(aspiration) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{aspiration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Histórias de Sucesso</h2>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Veja o que nossos usuários alcançaram com o BR AI:
              </p>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">{testimonial.name}</h3>
                          <span className="text-gray-400 text-sm">{testimonial.age} anos</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">
                            -{testimonial.weightLost}kg
                          </span>
                          <span className="text-gray-400">em {testimonial.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote className="w-6 h-6 text-green-400/30 absolute -top-1 -left-1" />
                      <p className="text-gray-300 text-sm pl-6 italic">
                        {testimonial.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-400/10 to-blue-500/10 border border-green-400/30 rounded-lg p-4 mt-4">
                <p className="text-center text-white font-medium">
                  Você também pode alcançar seus objetivos! 💪
                </p>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Frequência de Treinos</h2>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Quantos treinos você faz por semana?
              </p>

              <div className="space-y-2">
                {[
                  { value: '0-2', label: '0 a 2 treinos', desc: 'Iniciante ou pouco ativo' },
                  { value: '3-5', label: '3 a 5 treinos', desc: 'Intermediário' },
                  { value: '6+', label: '6 ou mais treinos', desc: 'Avançado' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, workoutsPerWeek: option.value as WorkoutsPerWeek })}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      formData.workoutsPerWeek === option.value
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-black border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl font-bold text-white">Meta de Peso</h2>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Qual a velocidade desejada para atingir sua meta?
              </p>

              <div className="space-y-2">
                {[
                  { value: 'lose_fast', label: 'Perder Peso Rápido', desc: '-1kg por semana', icon: TrendingDown, color: 'red' },
                  { value: 'lose_moderate', label: 'Perder Peso Moderado', desc: '-0.5kg por semana', icon: TrendingDown, color: 'orange' },
                  { value: 'lose_slow', label: 'Perder Peso Devagar', desc: '-0.25kg por semana', icon: TrendingDown, color: 'yellow' },
                  { value: 'maintain', label: 'Manter Peso', desc: 'Sem mudança', icon: Minus, color: 'blue' },
                  { value: 'gain_slow', label: 'Ganhar Peso Devagar', desc: '+0.25kg por semana', icon: TrendingUp, color: 'cyan' },
                  { value: 'gain_moderate', label: 'Ganhar Peso Moderado', desc: '+0.5kg por semana', icon: TrendingUp, color: 'green' },
                  { value: 'gain_fast', label: 'Ganhar Peso Rápido', desc: '+1kg por semana', icon: TrendingUp, color: 'emerald' },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, weightGoal: option.value as WeightGoal })}
                      className={`w-full p-3 rounded-lg border transition-all flex items-center gap-3 text-left ${
                        formData.weightGoal === option.value
                          ? `bg-${option.color}-500/20 border-${option.color}-500 text-white`
                          : 'bg-black border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${formData.weightGoal === option.value ? `text-${option.color}-400` : 'text-gray-500'}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Nível de Atividade</h2>
              </div>

              <div className="space-y-2">
                {[
                  { value: 'sedentary', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                  { value: 'light', label: 'Levemente Ativo', desc: 'Exercício 1-3 dias/semana' },
                  { value: 'moderate', label: 'Moderadamente Ativo', desc: 'Exercício 3-5 dias/semana' },
                  { value: 'active', label: 'Muito Ativo', desc: 'Exercício 6-7 dias/semana' },
                  { value: 'very_active', label: 'Extremamente Ativo', desc: 'Exercício intenso diário' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, activityLevel: option.value as any })}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      formData.activityLevel === option.value
                        ? 'bg-cyan-500/20 border-cyan-500 text-white'
                        : 'bg-black border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 bg-black border-gray-700 text-white hover:bg-gray-800"
              >
                Voltar
              </Button>
            )}
            {step < 9 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white hover:opacity-90"
                disabled={
                  (step === 1 && (!formData.name || !formData.age)) ||
                  (step === 2 && (!formData.weight || !formData.height || !formData.targetWeight))
                }
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white hover:opacity-90"
              >
                Começar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
