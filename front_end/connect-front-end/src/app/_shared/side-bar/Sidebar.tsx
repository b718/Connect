"use client";

import React, { useContext } from "react";
import SidebarRow from "./SidebarRow";
import styles from "./Sidebar.module.css";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import useWindowDimensions from "./useWindowDimensions";
import { SidebarContext } from "./SidebarContext";

const Sidebar = () => {
  const MOBILE_SIDEBAR_BREAK_POINT = 600;
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } =
    useContext(SidebarContext);
  const { width } = useWindowDimensions();
  const { user } = useUser();
  const userRole = user?.publicMetadata.role as string;

  const SidebarRows = () => (
    <>
      <SidebarRow
        rowName={userRole ? userRole.toLowerCase() : ""}
        rowIcon={
          <SignedIn>
            <UserButton />
          </SignedIn>
        }
      />
      <SidebarRow
        rowName={"Classes"}
        rowIcon={
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 11H6.2C5.07989 11 4.51984 11 4.09202 11.218C3.71569 11.4097 3.40973 11.7157 3.21799 12.092C3 12.5198 3 13.0799 3 14.2V21M21 21V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H14.2C13.0799 3 12.5198 3 12.092 3.21799C11.7157 3.40973 11.4097 3.71569 11.218 4.09202C11 4.51984 11 5.0799 11 6.2V21M22 21H2M14.5 7H17.5M14.5 11H17.5M14.5 15H17.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        redirectUrl={"classes"}
      />
    </>
  );

  const ToggleButton = () => (
    <button
      className={styles.ToggleButton}
      onClick={() => setIsCollapsed(!isCollapsed)}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={
            isCollapsed
              ? "M6 3L11 8L6 13"
              : "M10 3L5 8L10 13"
          }
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  const DesktopSidebar = () => (
    <div
      className={`${styles.SidebarInnerContainer} ${isCollapsed ? styles.SidebarInnerContainerCollapsed : ""}`}
    >
      <div
        className={`${styles.SidebarHeader} ${isCollapsed ? styles.SidebarHeaderCollapsed : ""}`}
      >
        {!isCollapsed && (
          <div className={styles.SidebarSectionSeperatorText}>Home</div>
        )}
        <ToggleButton />
      </div>
      <SidebarRows />
    </div>
  );

  const MobileSidebar = () => (
    <>
      <div
        className={styles.SidebarBurgerMenu}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <svg width="16" height="10" viewBox="0 0 16 10">
          <rect y="8" width="16" height="2" rx="1"></rect>
          <rect y="4" width="16" height="2" rx="1"></rect>
          <rect width="16" height="2" rx="1"></rect>
        </svg>
      </div>

      <div
        className={`${styles.SidebarOverlay} ${isMobileOpen ? styles.SidebarOverlayVisible : ""}`}
        onClick={() => setIsMobileOpen(false)}
      />
      <div
        className={`${styles.MobileSidebarPanel} ${isMobileOpen ? styles.MobileSidebarPanelOpen : ""}`}
      >
        <div className={styles.SidebarSectionSeperatorText}>Home</div>
        <SidebarRows />
      </div>
    </>
  );

  return (
    <div
      className={`${styles.SidebarContainer} ${isCollapsed ? styles.SidebarContainerCollapsed : ""}`}
    >
      {width > MOBILE_SIDEBAR_BREAK_POINT ? (
        <DesktopSidebar />
      ) : (
        <MobileSidebar />
      )}
    </div>
  );
};

export default Sidebar;
