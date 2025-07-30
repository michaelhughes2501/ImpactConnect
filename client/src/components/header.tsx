export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <i className="fas fa-heart text-white text-sm"></i>
        </div>
        <h1 className="text-lg font-semibold text-dark">SecondChance</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative">
          <i className="fas fa-bell text-gray-600 text-lg"></i>
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>
        <button>
          <i className="fas fa-cog text-gray-600 text-lg"></i>
        </button>
      </div>
    </header>
  );
}
