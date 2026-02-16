
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaSpinner } from 'react-icons/fa';

interface ProfileFormProps {
    name: string;
    email: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    isProfileUpdating: boolean;
    profileErrors: Record<string, string[]>;
    handleUpdateProfile: (e: React.SyntheticEvent) => void;
  }

export function ProfileForm({
    name,
    email,
    setName,
    setEmail,
    isProfileUpdating,
    profileErrors,
    handleUpdateProfile,
  }: ProfileFormProps) {
    return(
        <Card>
          <CardHeader>
            <CardTitle>プロフィール情報</CardTitle>
            <CardDescription>名前とメールアドレスを変更できます。</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className={profileErrors.name ? "border-red-500" : ""}
                />
                {profileErrors.name && <p className="text-red-500 text-xs">{profileErrors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className={profileErrors.email ? "border-red-500" : ""}
                />
                {profileErrors.email && <p className="text-red-500 text-xs">{profileErrors.email[0]}</p>}
              </div>
              <Button disabled={isProfileUpdating} className="bg-orange-500 hover:bg-orange-600">
                {isProfileUpdating && <FaSpinner className="mr-2 animate-spin" />}
                保存する
              </Button>
            </form>
          </CardContent>
        </Card>
    );
}