import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaSpinner } from 'react-icons/fa';

interface PasswordFormProps {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
    isPasswordUpdating: boolean;
    passwordErrors: Record<string, string[]>;
    setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    setPasswordConfirmation: React.Dispatch<React.SetStateAction<string>>;
    handleUpdatePassword: (e: React.SyntheticEvent) => void;
}

export function PasswordForm({
    currentPassword,
    password,
    passwordConfirmation,
    isPasswordUpdating,
    passwordErrors,
    setCurrentPassword,
    setPassword,
    setPasswordConfirmation,
    handleUpdatePassword,
}: PasswordFormProps) {
    return(
        <Card>
          <CardHeader>
            <CardTitle>パスワード変更</CardTitle>
            <CardDescription>セキュリティ確保のため、定期的な変更をおすすめします。</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">現在のパスワード</Label>
                <Input 
                  id="current_password" 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className={passwordErrors.current_password ? "border-red-500" : ""}
                />
                {passwordErrors.current_password && <p className="text-red-500 text-xs">{passwordErrors.current_password[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">新しいパスワード</Label>
                <Input 
                  id="new_password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className={passwordErrors.password ? "border-red-500" : ""}
                />
                {passwordErrors.password && <p className="text-red-500 text-xs">{passwordErrors.password[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">新しいパスワード（確認）</Label>
                <Input 
                  id="password_confirmation" 
                  type="password" 
                  value={passwordConfirmation} 
                  onChange={(e) => setPasswordConfirmation(e.target.value)} 
                />
              </div>
              <Button disabled={isPasswordUpdating} variant="outline" className="hover:bg-gray-100">
                {isPasswordUpdating && <FaSpinner className="mr-2 animate-spin" />}
                パスワードを更新
              </Button>
            </form>
          </CardContent>
        </Card>
    );
}