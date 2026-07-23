import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/hooks/useNotifications';

const MESSAGES = {
  mention: (n) => `${n.actor?.name || 'Someone'} mentioned you in "${n.document?.title || 'a document'}"`,
  comment: (n) => `${n.actor?.name || 'Someone'} commented on "${n.document?.title || 'a document'}"`,
  share: (n) => `${n.actor?.name || 'Someone'} shared "${n.document?.title || 'a document'}" with you`,
  invite: (n) => `${n.actor?.name || 'Someone'} invited you to "${n.document?.title || 'a document'}"`,
};

export function NotificationBell() {
  const navigate = useNavigate();
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSelect = (notification) => {
    if (!notification.read) markRead.mutate(notification._id);
    if (notification.document) navigate(`/documents/${notification.document._id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-md outline-none hover:bg-muted">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-1.5 py-1">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />

        {notifications.length === 0 && (
          <p className="p-3 text-sm text-muted-foreground">No notifications yet.</p>
        )}

        <div className="max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <DropdownMenuItem
              key={n._id}
              onClick={() => handleSelect(n)}
              className={`flex-col items-start gap-0.5 whitespace-normal py-2 ${!n.read ? 'bg-muted/50' : ''}`}
            >
              <span className="text-sm">{(MESSAGES[n.type] || MESSAGES.comment)(n)}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
