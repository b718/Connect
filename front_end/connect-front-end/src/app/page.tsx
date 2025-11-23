import MainScreen from "./_shared/main-screen/MainScreen";
import Sidebar from "./_shared/side-bar/Sidebar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<div />} />
    </div>
  );
}
