import AuthComponents from './auth/components';

export default function HomePage() {
  return (
    <div>
      {/* هدر برنامه اصلی شما */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">نام برنامه شما</h1>
            {/* سیستم احراز هویت در هدر */}
            <div className="w-80">
              <AuthComponents />
            </div>
          </div>
        </div>
      </header>

      {/* محتوای اصلی برنامه شما */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* سایدبار */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4">منو</h3>
              {/* منوهای برنامه شما */}
            </div>
          </aside>

          {/* محتوای اصلی */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">محتوای اصلی برنامه</h2>
              {/* محتوای برنامه اصلی شما */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}