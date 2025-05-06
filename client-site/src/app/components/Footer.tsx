export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold">TripTales</h2>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition">About</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
          </div>
        </div>
      </footer>
    );
  }
  