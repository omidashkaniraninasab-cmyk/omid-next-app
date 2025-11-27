export const metadata = {
  title: 'Omid Next App',
  description: 'سیستم احراز هویت حرفه‌ای',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}