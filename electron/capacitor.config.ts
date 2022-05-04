import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jeep.app.solidjs',
  appName: 'capacitor-solid-sqlite',
  webDir: 'dist',
  bundledWebRuntime: false,
  //  hideLogs: true,
  plugins: {
    CapacitorSQLite: {
      electronWindowsLocation: "C:\\ProgramData\\CapacitorDatabases",
      electronMacLocation: "/Volumes/Development_Lacie/Development/CapacitorDatabases",
      electronLinuxLocation: "Databases"
    }
  }
};

export default config;
