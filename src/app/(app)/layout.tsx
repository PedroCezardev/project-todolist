import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebar/sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="layoutContainer">
      <Sidebar mode="search" />
      <div className="contentWrapper">
        <Navbar />
        <main className="mainContent">
          {children}
        </main>
      </div>
    </div>
  );
}