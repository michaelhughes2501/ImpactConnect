import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Message, Match, User } from "@shared/schema";
import { CURRENT_USER_ID } from "@/lib/currentUser";

type MatchWithUsers = Match & { user1: User; user2: User };

export default function Chat() {
  const { matchId } = useParams<{ matchId: string }>();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: matchData } = useQuery<MatchWithUsers>({
    queryKey: ['/api/match', matchId],
    enabled: !!matchId,
  });

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages/match', matchId],
    enabled: !!matchId,
  });

  const otherUser = matchData
    ? matchData.user1Id === CURRENT_USER_ID
      ? matchData.user2
      : matchData.user1
    : null;

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/messages', {
        matchId,
        senderId: CURRENT_USER_ID,
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages/match', matchId] });
      setNewMessage("");
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && matchId) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (matchId) {
      apiRequest('PATCH', `/api/messages/read/${matchId}/${CURRENT_USER_ID}`, {});
    }
  }, [matchId]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <div className="animate-pulse p-4">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-3 sticky top-0 z-50">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <i className="fas fa-arrow-left"></i>
          </Button>
        </Link>
        <div
          className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
          style={{
            backgroundImage: `url(${otherUser?.photos?.[0] || 'https://via.placeholder.com/40'})`,
          }}
        ></div>
        <div className="flex-1">
          <h2 className="font-semibold text-dark">{otherUser?.name || "Chat"}</h2>
          <p className="text-xs text-gray-500">{otherUser?.occupation || "Active now"}</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-xs text-gray-500">Active</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-heart text-primary text-4xl mb-4"></i>
            <h3 className="font-medium text-gray-600 mb-2">
              You connected with {otherUser?.name || "someone"}!
            </h3>
            <p className="text-gray-500 text-sm">Send a kite to start talking</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === CURRENT_USER_ID ? 'justify-end' : 'justify-start'}`}
            >
              {message.senderId !== CURRENT_USER_ID && otherUser && (
                <div
                  className="w-7 h-7 rounded-full bg-cover bg-center mr-2 flex-shrink-0 self-end"
                  style={{ backgroundImage: `url(${otherUser.photos?.[0] || ''})` }}
                ></div>
              )}
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.senderId === CURRENT_USER_ID
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === CURRENT_USER_ID ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {new Date(message.createdAt!).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write your kite..."
            className="flex-1 rounded-full"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="bg-primary hover:bg-primary/90 rounded-full w-10 h-10 p-0"
          >
            <i className="fas fa-paper-plane text-sm"></i>
          </Button>
        </div>
      </form>
    </div>
  );
}
