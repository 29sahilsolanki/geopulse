import Footer from "@/components/common/Footer";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ManagerProvider } from "@/context/ManagerContext";
import { WorkerProvider } from "@/context/WorkerContext";
import ToastProvider from "@/lib/toastify";
import QueryProvider from "./QueryProvider";
export const metadata = {
  title: "GeoPulse",
  description: "Manage or track employees",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ToastProvider>
            <ManagerProvider>
              <WorkerProvider>
                {children}
                <Footer />
              </WorkerProvider>
            </ManagerProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
