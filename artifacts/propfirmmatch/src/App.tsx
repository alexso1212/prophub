import { Switch, Route, Router as WouterRouter } from "wouter";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import FirmPage from "./pages/FirmPage";
import OffersPage from "./pages/OffersPage";
import ChallengesPage from "./pages/ChallengesPage";
import BestSellersPage from "./pages/BestSellersPage";
import ReviewsPage from "./pages/ReviewsPage";
import FavoritesPage from "./pages/FavoritesPage";
import RulesPage from "./pages/RulesPage";
import PayoutsPage from "./pages/PayoutsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import BrokersPage from "./pages/BrokersPage";
import NewsPage from "./pages/NewsPage";
import SimplePage from "./pages/SimplePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/futures" component={HomePage} />
      <Route path="/futures/all-prop-firms" component={HomePage} />
      <Route path="/futures/prop-firms/:slug" component={FirmPage} />

      <Route path="/futures/exclusive-offers" component={OffersPage} />
      <Route path="/futures/offers" component={OffersPage} />

      <Route path="/futures/prop-firm-challenges" component={ChallengesPage} />
      <Route path="/futures/challenges" component={ChallengesPage} />

      <Route path="/futures/best-sellers" component={BestSellersPage} />

      <Route path="/futures/prop-firm-reviews" component={ReviewsPage} />
      <Route path="/futures/reviews" component={ReviewsPage} />

      <Route path="/futures/favorite-firms" component={FavoritesPage} />
      <Route path="/futures/favorites" component={FavoritesPage} />

      <Route path="/futures/prop-firm-rules" component={RulesPage} />

      <Route path="/futures/payouts" component={PayoutsPage} />

      <Route path="/futures/payouts-leaderboard" component={LeaderboardPage} />
      <Route path="/futures/leaderboard" component={LeaderboardPage} />

      <Route path="/futures/brokers" component={BrokersPage} />

      <Route path="/futures/news" component={NewsPage} />

      <Route>
        <SimplePage title="页面未找到" body="你访问的页面不存在，请返回首页继续浏览。" />
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
