import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-[150vh] bg-white">
      <div
        className="w-screen h-full bg-cover bg-center border-8 border-black rounded-2xl shadow-lg relative"
        style={{
          backgroundColor: "#0000006e",
          // backgroundImage: "url('/images/view.png')",
        }}
      >
        {/* Content Container */}
        <div className="pt-20">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
