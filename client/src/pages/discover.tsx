import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ProfileCard from "../components/profile-card";
import SafetyBanner from "../components/safety-banner";
import MatchModal from "../components/match-modal";
import type { User, Match } from "@shared/schema";
import { CURRENT_USER_ID } from "@/lib/currentUser";

export default function Discover() {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  const { data: discoveryUsers = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/discover', CURRENT_USER_ID],
  });

  const likeMutation = useMutation({
    mutationFn: async (data: { toUserId: string; isSuper?: boolean }) => {
      const response = await apiRequest('POST', '/api/likes', {
        fromUserId: CURRENT_USER_ID,
        toUserId: data.toUserId,
        isSuper: data.isSuper || false,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.match) {
        setCurrentMatch(data.match);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/discover', CURRENT_USER_ID] });
    },
  });

  const handleLike = (userId: string, isSuper = false) => {
    likeMutation.mutate({ toUserId: userId, isSuper });
  };

  const handlePass = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/discover', CURRENT_USER_ID] });
  };

  if (isLoading) {
    return (
      <section className="p-4">
        <SafetyBanner />
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark">Free World Connections</h2>
        </div>
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
        </div>
      </section>
    );
  }

  const currentUser = discoveryUsers[0];

  return (
    <>
      <section className="p-4">
        <SafetyBanner />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark">Free World Connections</h2>
          <button className="flex items-center space-x-2 text-primary text-sm font-medium">
            <i className="fas fa-sliders-h"></i>
            <span>Set My Game</span>
          </button>
        </div>

        {currentUser ? (
          <>
            <ProfileCard
              user={currentUser}
              onLike={() => handleLike(currentUser.id)}
              onSuperLike={() => handleLike(currentUser.id, true)}
              onPass={handlePass}
            />

            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h3 className="font-medium text-dark mb-3">Today's Numbers</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-primary">12</div>
                  <div className="text-xs text-gray-600">Profile Checks</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-success">5</div>
                  <div className="text-xs text-gray-600">Props Received</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-secondary">2</div>
                  <div className="text-xs text-gray-600">New Connects</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-heart text-gray-300 text-4xl mb-4"></i>
            <h3 className="font-medium text-gray-600 mb-2">Yard's Empty Right Now</h3>
            <p className="text-gray-500 text-sm">Check back later, homie. More people getting out every day!</p>
          </div>
        )}
      </section>

      {currentMatch && (
        <MatchModal
          match={currentMatch}
          onClose={() => setCurrentMatch(null)}
        />
      )}
    </>
  );
}
