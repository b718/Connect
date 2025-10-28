import MainScreen from "./_shared/MainScreen";
import Sidebar from "./_shared/Sidebar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<div />} />
    </div>
  );
}
