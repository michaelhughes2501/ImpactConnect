import { Link } from "wouter";
import type { Match } from "@shared/schema";

interface MatchModalProps {
  match: Match;
  onClose: () => void;
}

export default function MatchModal({ match, onClose }: MatchModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full text-center">
        <div className="mb-4">
          <i className="fas fa-heart text-primary text-4xl mb-3"></i>
          <h3 className="font-semibold text-dark text-lg mb-2">It's a Match!</h3>
          <p className="text-gray-600 text-sm">You both liked each other</p>
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 bg-cover bg-center"></div>
          <div className="w-16 h-16 rounded-full bg-gray-200 bg-cover bg-center"></div>
        </div>

        <div className="space-y-3">
          <Link href={`/chat/${match.id}`}>
            <button 
              onClick={onClose}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </Link>
          <button 
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
}
