import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function UserNav() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">{user?.displayName}</span>
      <Avatar className="h-8 w-8 border border-gray-200">
        <AvatarFallback className="bg-white">
          <User className="h-4 w-4 text-gray-600" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}