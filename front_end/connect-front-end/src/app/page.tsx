import { Group, Panel } from "react-resizable-panels";
import MainScreen from "./_shared/main-screen/MainScreen";
import Sidebar from "./_shared/side-bar/Sidebar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <Group>
        <Panel>
          <Sidebar />
        </Panel>
        <Panel>
          <MainScreen component={<div />} />
        </Panel>
      </Group>
    </div>
  );
}
