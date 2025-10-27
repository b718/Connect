"use client";

import React, { FunctionComponent, ReactElement } from "react";
import { useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";

interface SidebarRowProps {
  rowName: string;
  rowIcon: ReactElement;
  redirectUrl: string;
}

const SidebarRow: FunctionComponent<SidebarRowProps> = ({
  rowName,
  rowIcon,
  redirectUrl,
}) => {
  const router = useRouter();
  const redirectToUrl = () => {
    router.push("/" + redirectUrl);
  };

  return (
    <div className={styles.SidebarRowContainer} onClick={redirectToUrl}>
      <div className={styles.SidebarRowIcon}>{rowIcon}</div>
      <p className={styles.SidebarRowText}>{rowName}</p>
    </div>
  );
};

export default SidebarRow;
