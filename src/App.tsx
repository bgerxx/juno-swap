import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Fallback from "./components/Fallback";
// views
const Home = lazy(() => import("./views/Home"));
const ViewToken = lazy(() => import("./views/ViewToken"));
const ViewPool = lazy(() => import("./views/ViewPool"));
const NativeTokens = lazy(() => import("./views/NativeTokens"));
const TokenPools = lazy(() => import("./views/TokenPools"));
const CW20Tokens = lazy(() => import("./views/CW20Tokens"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="native-token/:symbol" element={<ViewToken />} />
          <Route path="cw-20-token/:symbol" element={<ViewToken />} />
          <Route path="token-pool/:symbol" element={<ViewPool />} />
          <Route path="token-pools" element={<TokenPools />} />
          <Route path="native-tokens" element={<NativeTokens />} />
          <Route path="cw-20-tokens" element={<CW20Tokens />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
