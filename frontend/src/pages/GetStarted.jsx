export default function GetStarted() {
  return (
    <div className="w-full min-h-screen bg-primary-dark text-custom-white font-inter">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-secodary-gray"> 
        <h1 className="text-xl font-bold">CloudBox</h1>
        <nav className="space-x-8 text-sm text-text-gray">
          <a href="#" className="hover:text-custom-cyan transition">
            Features
          </a>
          <a href="#" className="hover:text-custom-cyan transition">
            Pricing
          </a>
          <a href="#" className="hover:text-custom-cyan transition">
            Login
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-4">
        <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
          Store, Share, and Access Files Seamlessly
        </h2>
        <p className="text-text-gray max-w-2xl mx-auto mb-10 text-lg">
          Access your files anywhere with a modern, secure, and fast cloud storage
          solution designed for you.
        </p>
        <button className="bg-custom-cyan text-custom-white px-8 py-3 rounded-2xl font-medium shadow-md hover:bg-[#3567e6] transition">
          Get Started
        </button>
      </section>

      {/* File Preview Grid */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold mb-8">Sample Files</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {["Report.pdf", "Design.png", "Music.mp3", "Video.mp4"].map((file, i) => (
            <div
              key={i}
              className="bg-menu-gray rounded-2xl p-5 hover:bg-file-hover transition cursor-pointer shadow-md"
            >
              <div className="h-36 flex items-center justify-center bg-secodary-dark rounded-xl mb-4">
                <span className="text-text-gray text-sm">Preview</span>
              </div>
              <p className="truncate text-sm">{file}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
