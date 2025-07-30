import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Match, User } from "@shared/schema";

// Mock current user ID
const CURRENT_USER_ID = "user1";

export default function Matches() {
  const { data: matches = [], isLoading } = useQuery<(Match & { otherUser: User })[]>({
    queryKey: ['/api/matches', CURRENT_USER_ID],
  });

  if (isLoading) {
    return (
      <section className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark">Your Matches</h2>
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
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

  const recentMatches = matches.slice(0, 4);

  return (
    <section className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-dark">Your Connects</h2>
        <span className="text-sm text-gray-500">{matches.length} solid</span>
      </div>

      {matches.length > 0 ? (
        <>
          <div className="mb-6">
            <h3 className="font-medium text-dark mb-3 text-sm">Fresh Connects</h3>
            <div className="grid grid-cols-4 gap-3">
              {recentMatches.map((match) => (
                <Link key={match.id} href={`/chat/${match.id}`}>
                  <div className="text-center cursor-pointer">
                    <div 
                      className="w-16 h-16 rounded-full bg-cover bg-center mb-2 border-2 border-primary"
                      style={{ 
                        backgroundImage: `url(${match.otherUser.photos?.[0] || 'https://via.placeholder.com/64'})` 
                      }}
                    ></div>
                    <span className="text-xs text-gray-700 font-medium">
                      {match.otherUser.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-dark mb-3 text-sm">All Your People</h3>
            <div className="space-y-3">
              {matches.map((match) => (
                <Link key={match.id} href={`/chat/${match.id}`}>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <div 
                      className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                      style={{ 
                        backgroundImage: `url(${match.otherUser.photos?.[0] || 'https://via.placeholder.com/48'})` 
                      }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-dark text-sm">{match.otherUser.name}</h4>
                      <p className="text-gray-500 text-xs">Connected recently</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {new Date(match.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <i className="fas fa-heart text-gray-300 text-4xl mb-4"></i>
          <h3 className="font-medium text-gray-600 mb-2">No connects yet</h3>
          <p className="text-gray-500 text-sm">Start checking the yard to find your people!</p>
        </div>
      )}
    </section>
  );
}
