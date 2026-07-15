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
        <div className="absolute inset-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-shadow duration-200 hover:shadow-xl">
          <div
            className="h-64 bg-cover bg-center relative group"
            style={{ backgroundImage: `url(${user.photos?.[0] || 'https://via.placeholder.com/400x300'})` }}
          >
            <div className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
              <i className="fas fa-check-circle mr-1"></i>
              Cleared
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg drop-shadow-sm">
                {user.name}, {user.age}
              </h3>
              <p className="text-white/90 text-sm flex items-center gap-1">
                <i className="fas fa-location-dot text-xs"></i>
                {user.location}
              </p>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-briefcase text-gray-400 text-sm w-4"></i>
              <span className="text-gray-600 text-sm">{user.occupation}</span>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <i className="fas fa-graduation-cap text-gray-400 text-sm w-4"></i>
              <span className="text-gray-600 text-sm">{user.education}</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-6 sm:space-x-8 mb-6">
        <button
          onClick={onPass}
          aria-label="Pass"
          className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shadow-md hover:bg-gray-200 hover:shadow-lg active:scale-90 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
        >
          <i className="fas fa-times text-gray-500 text-xl"></i>
        </button>
        <button
          onClick={onSuperLike}
          aria-label="Super like"
          className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-md hover:bg-secondary/90 hover:shadow-lg active:scale-90 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
        >
          <i className="fas fa-star text-white text-lg"></i>
        </button>
        <button
          onClick={onLike}
          aria-label="Like"
          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-90 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <i className="fas fa-heart text-white text-2xl"></i>
        </button>
      </div>
    </>
  );
}
