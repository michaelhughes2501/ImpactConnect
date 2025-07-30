import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Message, Match, User } from "@shared/schema";

// Mock current user ID
const CURRENT_USER_ID = "user1";

export default function Messages() {
  const { data: recentMessages = [], isLoading } = useQuery<(Message & { match: Match; otherUser: User })[]>({
    queryKey: ['/api/messages/recent', CURRENT_USER_ID],
  });

  if (isLoading) {
    return (
      <section className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark">Messages</h2>
          <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-dark">Kites</h2>
        <button className="text-primary text-sm font-medium">
          Mark read
        </button>
      </div>

      {recentMessages.length > 0 ? (
        <div className="space-y-3 mb-6">
          {recentMessages.map((messageThread) => (
            <Link key={messageThread.match.id} href={`/chat/${messageThread.match.id}`}>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <div 
                  className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0 relative"
                  style={{ 
                    backgroundImage: `url(${messageThread.otherUser.photos?.[0] || 'https://via.placeholder.com/48'})` 
                  }}
                >
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-dark text-sm">{messageThread.otherUser.name}</h4>
                    <span className="text-xs text-gray-400">
                      {new Date(messageThread.createdAt!).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm truncate">{messageThread.content}</p>
                </div>
                <div className="flex flex-col items-end">
                  {!messageThread.isRead && messageThread.senderId !== CURRENT_USER_ID && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <i className="fas fa-comment text-gray-300 text-4xl mb-4"></i>
          <h3 className="font-medium text-gray-600 mb-2">No kites yet</h3>
          <p className="text-gray-500 text-sm">Start talking with your connects!</p>
        </div>
      )}

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <i className="fas fa-exclamation-triangle text-warning text-sm mt-0.5"></i>
          <div>
            <h4 className="font-medium text-yellow-800 text-sm">Stay Safe Out Here</h4>
            <p className="text-yellow-700 text-xs mt-1">
              Keep your business to yourself until you know someone's solid. Always meet in public spots first time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
