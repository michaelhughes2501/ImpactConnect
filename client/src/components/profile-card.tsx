import type { User } from "@shared/schema";

interface ProfileCardProps {
  user: User;
  onLike: () => void;
  onSuperLike: () => void;
  onPass: () => void;
}

export default function ProfileCard({ user, onLike, onSuperLike, onPass }: ProfileCardProps) {
  return (
    <>
      <div className="relative h-96 mb-6">
        <div className="absolute inset-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div 
            className="h-64 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${user.photos?.[0] || 'https://via.placeholder.com/400x300'})` }}
          >
            <div className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded-full flex items-center">
              <i className="fas fa-check-circle mr-1"></i>
              Cleared
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg">
                {user.name}, {user.age}
              </h3>
              <p className="text-white/90 text-sm">{user.location}</p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-briefcase text-gray-400 text-sm"></i>
              <span className="text-gray-600 text-sm">{user.occupation}</span>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <i className="fas fa-graduation-cap text-gray-400 text-sm"></i>
              <span className="text-gray-600 text-sm">{user.education}</span>
            </div>
            <p className="text-gray-700 text-sm">{user.bio}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-8 mb-6">
        <button 
          onClick={onPass}
          className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shadow-md hover:bg-gray-200 transition-colors"
        >
          <i className="fas fa-times text-gray-500 text-xl"></i>
        </button>
        <button 
          onClick={onSuperLike}
          className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center shadow-md hover:bg-secondary/90 transition-colors"
        >
          <i className="fas fa-star text-white text-xl"></i>
        </button>
        <button 
          onClick={onLike}
          className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
        >
          <i className="fas fa-heart text-white text-xl"></i>
        </button>
      </div>
    </>
  );
}
