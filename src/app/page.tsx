'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { Onboarding } from '@/components/custom/onboarding';
import { Dashboard } from '@/components/custom/dashboard';
import { createUserProfile, getUserProfile } from '@/lib/supabase-actions';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se as variáveis de ambiente do Supabase estão configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setError('Supabase não configurado. Configure as variáveis de ambiente.');
      setLoading(false);
      return;
    }

    // Verificar se existe um perfil salvo no localStorage
    const savedUserId = localStorage.getItem('br-ai-user-id');
    
    if (savedUserId) {
      // Carregar perfil do Supabase
      loadUserProfile(savedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async (id: string) => {
    try {
      const { data, error } = await getUserProfile(id);
      
      if (error) {
        console.error('Erro ao carregar perfil:', error);
        // Se não encontrar, limpar localStorage e mostrar onboarding
        localStorage.removeItem('br-ai-user-id');
        setLoading(false);
        return;
      }

      if (data) {
        // Converter dados do Supabase para o formato UserProfile
        const profile: UserProfile = {
          name: data.name,
          age: data.age,
          weight: data.weight,
          height: data.height,
          gender: data.gender,
          goal: data.goal,
          targetWeight: data.target_weight,
          activityLevel: data.activity_level,
          dailyCalorieGoal: data.daily_calorie_goal,
          workoutsPerWeek: data.workouts_per_week,
          weightGoal: data.weight_goal,
          hasUsedCalorieApps: data.has_used_calorie_apps,
          previousApps: data.previous_apps || [],
          subscriptionStatus: data.subscription_status,
          trialStartDate: data.trial_start_date,
          subscriptionEndDate: data.subscription_end_date,
        };

        setUserProfile(profile);
        setUserId(data.id);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    try {
      // Salvar perfil no Supabase
      const { data, error } = await createUserProfile(profile);

      if (error) {
        console.error('Erro ao criar perfil:', error);
        throw new Error('Erro ao salvar perfil: ' + (error.message || 'Tente novamente'));
      }

      if (!data) {
        throw new Error('Erro ao salvar perfil. Tente novamente.');
      }

      // Salvar ID do usuário no localStorage
      localStorage.setItem('br-ai-user-id', data.id);
      setUserId(data.id);
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Erro no onboarding:', err);
      throw err;
    }
  };

  const handleResetProfile = () => {
    if (confirm('Tem certeza que deseja resetar seu perfil? Todos os dados serão perdidos.')) {
      localStorage.removeItem('br-ai-user-id');
      setUserProfile(null);
      setUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-sm border border-red-500/20 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-2">Configuração Necessária</h2>
              <p className="text-gray-300 text-sm mb-4">{error}</p>
              <div className="bg-gray-800/50 rounded p-3 text-xs text-gray-400 font-mono">
                <p className="mb-2">Configure no arquivo .env.local:</p>
                <p>NEXT_PUBLIC_SUPABASE_URL=sua_url</p>
                <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile || !userId) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard profile={userProfile} userId={userId} onResetProfile={handleResetProfile} />;
}
