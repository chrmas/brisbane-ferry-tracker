export function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-[1001] bg-white/90 backdrop-blur-sm border-t border-gray-200 py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>
              Data © <a href="https://translink.com.au" target="_blank" rel="noopener noreferrer" className="hover:underline">TransLink Queensland</a>
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              Map © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap</a>
            </span>
          </div>
          <div>
            <span>Licensed under CC BY 4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
