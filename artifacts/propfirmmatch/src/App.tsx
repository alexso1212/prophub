import { Switch, Route, Router as WouterRouter } from "wouter";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import FirmPage from "./pages/FirmPage";
import SimplePage from "./pages/SimplePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/futures/all-prop-firms" component={HomePage} />
      <Route path="/futures/prop-firms/:slug" component={FirmPage} />
      <Route path="/futures/offers">
        <SimplePage title="Exclusive Futures Offers" body="Discover the latest discount codes and promotional deals from all 21 listed prop firms." />
      </Route>
      <Route path="/futures/challenges">
        <SimplePage title="All Challenges" body="Browse every funded challenge across all prop firms — filter by account size, price, and program type." />
      </Route>
      <Route path="/futures/best-sellers">
        <SimplePage title="Best Sellers" body="The most popular challenges purchased by traders this month." />
      </Route>
      <Route path="/futures/reviews">
        <SimplePage title="Reviews" body="Read verified reviews from real funded traders to learn which firms deliver." />
      </Route>
      <Route path="/futures/favorites">
        <SimplePage title="Favorite Firms" body="Save up to three firms to your favorites for quick comparison." />
      </Route>
      <Route path="/futures/prop-firm-rules">
        <SimplePage title="Prop Firm Rules" body="Compare consistency rules, daily drawdown, profit targets and more across every firm." />
      </Route>
      <Route path="/futures/payouts">
        <SimplePage title="Payouts" body="Verified payout reports from real traders. Updated daily." />
      </Route>
      <Route path="/futures/brokers">
        <SimplePage title="Brokers" body="The brokers powering each prop firm — Dorman, NinjaTrader, Tradovate, Rithmic and more." />
      </Route>
      <Route>
        <SimplePage title="Page not found" body="The page you're looking for doesn't exist." />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Layout>
        <Router />
      </Layout>
    </WouterRouter>
  );
}

export default App;
