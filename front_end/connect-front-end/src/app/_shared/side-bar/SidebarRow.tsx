"use client";

import React, { FunctionComponent, ReactElement } from "react";
import { useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";
import { useUser } from "@clerk/nextjs";

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
  const userRole = user?.publicMetadata.role as string;
  const router = useRouter();
  const redirectToUrl = () => {
    if (!redirectUrl) return;
    const homepageRedirectUrl = "/";

    if (redirectUrl == homepageRedirectUrl) {
      router.push("/" + redirectUrl);
    } else {
      router.push("/" + userRole.toLowerCase() + "/" + redirectUrl);
    }
  };

  return (
    <div className={styles.SidebarRowContainer} onClick={redirectToUrl}>
      <div className={styles.SidebarRowIcon}>{rowIcon}</div>
      <p className={styles.SidebarRowText}>{rowName}</p>
    </div>
  );
};

export default SidebarRow;
