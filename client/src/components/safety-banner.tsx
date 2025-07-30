export default function SafetyBanner() {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
      <div className="flex items-start space-x-3">
        <i className="fas fa-shield-alt text-primary text-lg mt-0.5"></i>
        <div>
          <h3 className="font-medium text-dark text-sm">Stay Protected Out Here</h3>
          <p className="text-gray-600 text-xs mt-1">
            Everyone's background checked. Flag anything that feels off right away.
          </p>
          <button className="text-primary text-xs font-medium mt-1 hover:underline">
            Safety Rules →
          </button>
        </div>
      </div>
    </div>
  );
}
