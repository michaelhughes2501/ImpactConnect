export default function SafetyBanner() {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
      <div className="flex items-start space-x-3">
        <i className="fas fa-shield-alt text-primary text-lg mt-0.5"></i>
        <div>
          <h3 className="font-medium text-dark text-sm">Your Safety Matters</h3>
          <p className="text-gray-600 text-xs mt-1">
            All profiles are verified. Report any concerns immediately.
          </p>
          <button className="text-primary text-xs font-medium mt-1 hover:underline">
            View Safety Guidelines →
          </button>
        </div>
      </div>
    </div>
  );
}
