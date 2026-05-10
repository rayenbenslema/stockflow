import type { ReactNode } from "react";
import {
  GridIcon,
  BoxCubeIcon,
  DollarLineIcon,
  FileIcon,
  GroupIcon,
  UserCircleIcon,
  PieChartIcon,
  DownloadIcon,
  PlugInIcon,
  CalenderIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  LockIcon,
} from "../icons";

const iconMap: Record<string, ReactNode> = {
  dashboard: <GridIcon />,
  inventory: <BoxCubeIcon />,
  pos: <DollarLineIcon />,
  invoice: <FileIcon />,
  clients: <GroupIcon />,
  suppliers: <UserCircleIcon />,
  analytics: <PieChartIcon />,
  exports: <DownloadIcon />,
  settings: <PlugInIcon />,
  calendar: <CalenderIcon />,
  forms: <ListIcon />,
  tables: <TableIcon />,
  pages: <PageIcon />,
  auth: <LockIcon />,
};

export function getModuleIcon(iconKey: string): ReactNode {
  return iconMap[iconKey] ?? <GridIcon />;
}
