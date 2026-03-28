// src/layouts/LandingLayout.jsx

import LandingNavbar from "../components/landing/LandingNavbar.jsx";

const LandingLayout = ({ children, className = "", containerClassName = "" }) => {
  return (
    <div
      className={[
        "min-h-screen w-full bg-surface-page text-text-body overflow-x-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Global Landing Navbar */}
      <LandingNavbar />

      {/* Page Content Wrapper */}
      <div
        className={[
          /*
            Sticky navbar offset.
            IMPORTANT:
            - This offset must be the ONLY global top spacing.
            - HeroSection should NOT add extra top padding on top of this.
          */
          containerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
};

export default LandingLayout;
