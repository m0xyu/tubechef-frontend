import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';
import { FaCog } from 'react-icons/fa';
import axios from 'axios';
import { ProfileForm } from '@/features/settings/components/ProfileForm';
import { PasswordForm } from '@/features/settings/components/PasswordForm';

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, updateUser } = useAuth();
  
  // プロフィール用
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string[]>>({});

  // パスワード用
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string[]>>({});

  const handleUpdateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsProfileUpdating(true);
    setProfileErrors({});
    try {
      await apiClient.put('/user/profile-information', { name, email });
      await updateUser();
      toast.success("プロフィールを更新しました");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setProfileErrors(err.response.data.errors);
      } else {
        toast.error("更新に失敗しました");
      }
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsPasswordUpdating(true);
    setPasswordErrors({});
    try {
      await apiClient.put('/user/password', {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');
      toast.success("パスワードを変更しました");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setPasswordErrors(err.response.data.errors);
        toast.error("パスワードの更新に失敗しました");
      } else {
        toast.error("エラーが発生しました");
      }
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
          <FaCog className="text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">アカウント設定</h1>
          <p className="text-sm text-gray-500">
            プロフィール情報とセキュリティの設定
          </p>
        </div>
      </div>

      <div className='grid gap-8'>
        <ProfileForm
          name={name}
          email={email}
          setName={setName}
          setEmail={setEmail}
          isProfileUpdating={isProfileUpdating}
          profileErrors={profileErrors}
          handleUpdateProfile={handleUpdateProfile}
        />

        {/* パスワード変更カード */}
        <PasswordForm 
          currentPassword={currentPassword}
          password={password}
          passwordConfirmation={passwordConfirmation}
          isPasswordUpdating={isPasswordUpdating}
          passwordErrors={passwordErrors}
          setCurrentPassword={setCurrentPassword}
          setPassword={setPassword}
          setPasswordConfirmation={setPasswordConfirmation}
          handleUpdatePassword={handleUpdatePassword}
          />
      </div>
    </div>
  );
}