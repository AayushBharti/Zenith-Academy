import type React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen">{children}</main>
);

export default Layout;
