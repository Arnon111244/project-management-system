// apps/mobile/src/devtools/reactotron.ts
import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Optional: redux/react-query integrations
// import { reactotronRedux } from 'reactotron-redux';

// const HOST = "localhost"; // or your machine LAN IP for real devices (e.g., '192.168.1.23')

// const tron = __DEV__
//   ? Reactotron.setAsyncStorageHandler!(AsyncStorage)
//       .configure({ name: "Investor App (RN)", host: HOST, port: 9090 })
//       .useReactNative({
//         networking: {
//           // keep symbolicate etc. out of logs
//           ignoreUrls: /symbolicate|logs|generate_204/i,
//         },
//         errors: { veto: (stackFrame) => false },
//       })
//       // .use(reactotronRedux()) // if you use Redux
//       .connect()
//   : undefined;
const HOST = "10.0.2.2";

const tron = __DEV__
  ? Reactotron.setAsyncStorageHandler!(AsyncStorage)
      .configure({
        name: "Investor App (RN)",
        host: HOST,
        port: 9090,
      })
      .useReactNative({
        networking: {
          ignoreUrls: /symbolicate|logs|generate_204/i,
        },
        errors: { veto: () => false },
      })
      .connect()
  : undefined;
// Handy console alias
if (__DEV__) {
  // @ts-ignore
  console.tron = Reactotron;
  Reactotron.clear?.();
}

export default tron;
