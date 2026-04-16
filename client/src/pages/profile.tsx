import { useQuery } from "@tanstack/react-query";
import type { User, Profile } from "@shared/schema";
import { CURRENT_USER_ID } from "@/lib/currentUser";

export default function Profile() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/users', CURRENT_USER_ID],
  });

  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ['/api/profiles', CURRENT_USER_ID],
  });

  if (userLoading || profileLoading) {
    return (
      <section className="p-4">
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>
      </section>
    );
  }

  if (!user || !profile) {
    return (
      <section className="p-4">
        <div className="text-center py-12">
          <i className="fas fa-user text-gray-300 text-4xl mb-4"></i>
          <h3 className="font-medium text-gray-600 mb-2">Profile not found</h3>
        </div>
      </section>
    );
  }

  const stats = profile.stats as any || {};

  return (
    <section className="p-4">
      <div className="text-center mb-6">
        <div
          className="w-24 h-24 rounded-full bg-cover bg-center mx-auto mb-3 border-4 border-primary/20"
          style={{
            backgroundImage: `url(${user.photos?.[0] || 'https://via.placeholder.com/96'})`,
          }}
        ></div>
        <h2 className="font-semibold text-dark text-lg">{user.name}, {user.age}</h2>
        <p className="text-gray-500 text-sm">{user.occupation}</p>
        <p className="text-gray-500 text-xs">{user.location}</p>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <i className="fas fa-check-circle text-success text-sm"></i>
          <span className="text-success text-sm font-medium">Background Checked</span>
        </div>
      </div>

      {user.bio && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-gray-700 text-sm leading-relaxed">"{user.bio}"</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-primary">{stats.profileViews || 0}</div>
          <div className="text-xs text-gray-600">Profile Checks</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-success">{stats.matches || 0}</div>
          <div className="text-xs text-gray-600">Solid Connects</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-secondary">{stats.responseRate || 0}%</div>
          <div className="text-xs text-gray-600">Kite Back Rate</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <i className="fas fa-edit mr-2"></i>Update My Info
        </button>
        <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          <i className="fas fa-rocket mr-2"></i>Get More Visibility
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-dark text-sm mb-3">Settings & Privacy</h3>

        {[
          { icon: "shield-alt", text: "Keep It Private" },
          { icon: "heart-pulse", text: "Stay Safe" },
          { icon: "bell", text: "Alerts" },
          { icon: "cog", text: "My Settings" },
          { icon: "question-circle", text: "Need Help" },
        ].map((item, index) => (
          <button key={index} className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <i className={`fas fa-${item.icon} text-gray-600`}></i>
              <span className="text-gray-700 font-medium">{item.text}</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <h4 className="font-medium text-dark text-sm mb-2">Yard Rules</h4>
        <p className="text-gray-600 text-xs mb-3">
          Keeping it real and respectful for everyone trying to build something out here.
        </p>
        <button className="text-primary text-sm font-medium hover:underline">
          Check the Rules →
        </button>
      </div>
    </section>
  );
}
