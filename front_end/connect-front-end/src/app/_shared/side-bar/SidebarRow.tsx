"use client";

import React, { FunctionComponent, ReactElement, useContext } from "react";
import { useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";
import { useUser } from "@clerk/nextjs";
import { SidebarContext } from "./SidebarContext";

interface SidebarRowProps {
  rowName: string;
  rowIcon: ReactElement;
  redirectUrl?: string;
}

const SidebarRow: FunctionComponent<SidebarRowProps> = ({
  rowName,
  rowIcon,
  redirectUrl,
}) => {
  const { user } = useUser();
  const { isCollapsed, setIsMobileOpen } = useContext(SidebarContext);
  const userRole = user?.publicMetadata.role as string;
  const router = useRouter();
  const redirectToUrl = () => {
    if (!redirectUrl) return;
    const homepageRedirectUrl = "/";

    setIsMobileOpen(false);

    if (redirectUrl == homepageRedirectUrl) {
      router.push("/" + redirectUrl);
    } else {
      router.push("/" + userRole.toLowerCase() + "/" + redirectUrl);
    }
  };

  return (
    <div
      className={`${styles.SidebarRowContainer} ${isCollapsed ? styles.SidebarRowContainerCollapsed : ""}`}
      onClick={redirectToUrl}
      title={isCollapsed ? rowName : undefined}
    >
      <div className={styles.SidebarRowIcon}>{rowIcon}</div>
      {!isCollapsed && <p className={styles.SidebarRowText}>{rowName}</p>}
    </div>
  );
};

export default SidebarRow;
