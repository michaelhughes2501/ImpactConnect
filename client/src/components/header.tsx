import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import type { Message, Match, User } from "@shared/schema";
import { CURRENT_USER_ID } from "@/lib/currentUser";

export default function Header() {
  const { data: recentMessages = [] } = useQuery<
    (Message & { match: Match; otherUser: User })[]
  >({
    queryKey: ["/api/messages/recent", CURRENT_USER_ID],
  });

  const unreadCount = recentMessages.filter(
    (m) => !m.isRead && m.senderId !== CURRENT_USER_ID
  ).length;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <i className="fas fa-heart text-white text-sm"></i>
        </div>
        <h1 className="text-lg font-semibold text-dark">FreeWorld Connect</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="/messages"
          aria-label={unreadCount > 0 ? `View your Kites (${unreadCount} unread)` : "View your Kites"}
          className="relative text-gray-600 hover:text-primary transition-colors"
        >
          <i className="fas fa-bell text-lg"></i>
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-4 min-w-[16px] justify-center rounded-full px-1 py-0 text-[10px] leading-none">
              {unreadCount}
            </Badge>
          )}
        </Link>
        <Link
          href="/profile"
          aria-label="Your settings"
          className="text-gray-600 hover:text-primary transition-colors"
        >
          <i className="fas fa-cog text-lg"></i>
        </Link>
      </div>
    </header>
  );
}
