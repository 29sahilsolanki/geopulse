import Footer from "@/components/common/Footer";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ManagerProvider } from "@/context/ManagerContext";
import ToastProvider from "@/lib/toastify";
import QueryProvider from "./QueryProvider";
export const metadata = {
  title: "GeoPulse",
  description: "Manage or track employees",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ToastProvider>
            <ManagerProvider>
              {children}
              <Footer />
            </ManagerProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
