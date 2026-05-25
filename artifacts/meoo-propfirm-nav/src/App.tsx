import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import MindMapHome from './pages/MindMapHome';
import FirmsList from './pages/FirmsList';
import PlatformSelector from './pages/PlatformSelector';
import KnowledgeTree from './pages/KnowledgeTree';
import Guides from './pages/Guides';
import RulesComparison from './pages/RulesComparison';
import Software from './pages/Software';
import SoftwareGuide from './pages/SoftwareGuide';
import PayoutFlow from './pages/PayoutFlow';
import BeginnerPath from './pages/BeginnerPath';
import FirmDetail from './pages/FirmDetail';
import GuideDetail from './pages/GuideDetail';
import WhatIsPropFirm from './pages/learn/WhatIsPropFirm';
import DrawdownRules from './pages/learn/DrawdownRules';
import ConsistencyRule from './pages/learn/ConsistencyRule';
import IntradayLiquidation from './pages/learn/IntradayLiquidation';
import KycGuide from './pages/learn/KycGuide';
import LowCostPath from './pages/learn/LowCostPath';
import TradovateGuide from './pages/learn/TradovateGuide';
import RithmicGuide from './pages/learn/RithmicGuide';
import WisePayout from './pages/learn/WisePayout';
import W8FormGuide from './pages/learn/W8FormGuide';
import Disclosure from './pages/Disclosure';
import Header from './components/Header';
import Footer from './components/Footer';
import { firmsData } from './data/firms';

function LayoutWithChrome() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MindMapHome />} />
        <Route path="/home" element={<MindMapHome />} />
        <Route element={<LayoutWithChrome />}>
          <Route path="/platforms" element={<PlatformSelector />} />
          <Route path="/knowledge" element={<KnowledgeTree />} />
          <Route path="/software-guide" element={<SoftwareGuide />} />
          <Route path="/software" element={<Software />} />
          <Route path="/software/:slug" element={<SoftwareGuide />} />
          <Route path="/payout" element={<PayoutFlow />} />
          <Route path="/payouts" element={<PayoutFlow />} />
          <Route path="/payments" element={<PayoutFlow />} />
          <Route path="/beginner" element={<BeginnerPath />} />
          <Route path="/firms" element={<FirmsList />} />
          <Route path="/firms/:slug" element={<FirmDetail firms={firmsData} />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/what-is-futures-prop-firm" element={<WhatIsPropFirm />} />
          <Route path="/guides/drawdown-rules" element={<DrawdownRules />} />
          <Route path="/guides/consistency-rule" element={<ConsistencyRule />} />
          <Route path="/guides/intraday-liquidation" element={<IntradayLiquidation />} />
          <Route path="/guides/kyc-guide" element={<KycGuide />} />
          <Route path="/guides/low-cost-path" element={<LowCostPath />} />
          <Route path="/guides/tradovate-guide" element={<TradovateGuide />} />
          <Route path="/guides/rithmic-guide" element={<RithmicGuide />} />
          <Route path="/guides/wise-payout" element={<WisePayout />} />
          <Route path="/guides/w8-form-guide" element={<W8FormGuide />} />
          <Route path="/guides/:slug" element={<GuideDetail />} />
          <Route path="/rules" element={<RulesComparison />} />
          <Route path="/compare" element={<RulesComparison />} />
          <Route path="/disclosure" element={<Disclosure />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
