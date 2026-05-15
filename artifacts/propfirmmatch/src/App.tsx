import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
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
import SearchPage from "./pages/SearchPage";
import SimplePage from "./pages/SimplePage";
import AdminFirmsPage from "./pages/AdminFirmsPage";
import { FirmsOverridesProvider } from "./contexts/FirmsOverridesContext";

const rawClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
const clerkPubKey = rawClerkKey
  ? publishableKeyFromHost(window.location.hostname, rawClerkKey)
  : undefined;

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#f97316",
    colorForeground: "#f1f5f9",
    colorMutedForeground: "#94a3b8",
    colorDanger: "#ef4444",
    colorBackground: "#1a1f2e",
    colorInput: "#0f1420",
    colorInputForeground: "#f1f5f9",
    colorNeutral: "#2d3748",
    fontFamily: "Inter, sans-serif",
    borderRadius: "8px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: { color: "#f1f5f9" },
    headerSubtitle: { color: "#94a3b8" },
    socialButtonsBlockButtonText: { color: "#f1f5f9" },
    formFieldLabel: { color: "#94a3b8" },
    footerActionLink: { color: "#f97316" },
    footerActionText: { color: "#94a3b8" },
    dividerText: { color: "#94a3b8" },
    identityPreviewEditButton: { color: "#f97316" },
    formFieldSuccessText: { color: "#22c55e" },
    alertText: { color: "#f1f5f9" },
    logoBox: "",
    logoImage: "",
    socialButtonsBlockButton: { borderColor: "#2d3748" },
    formButtonPrimary: { background: "#f97316", color: "#000" },
    formFieldInput: { background: "#0f1420", borderColor: "#2d3748", color: "#f1f5f9" },
    footerAction: "",
    dividerLine: { borderColor: "#2d3748" },
    alert: { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" },
    otpCodeFieldInput: { background: "#0f1420", borderColor: "#2d3748", color: "#f1f5f9" },
    formFieldRow: "",
    main: "",
  },
};

function SignInPage() {
  return (
    <div style={{ display: "flex", minHeight: "100dvh", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div style={{ display: "flex", minHeight: "100dvh", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function AdminRouteWithClerk() {
  return (
    <>
      <Show when="signed-in">
        <AdminFirmsPage clerkEnabled />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function Router({ clerkEnabled }: { clerkEnabled: boolean }) {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/futures" component={HomePage} />
      <Route path="/futures/all-prop-firms" component={HomePage} />
      <Route path="/futures/prop-firms/:slug" component={FirmPage} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/admin/firms">
        {clerkEnabled ? <AdminRouteWithClerk /> : <AdminFirmsPage clerkEnabled={false} />}
      </Route>

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

      <Route path="/search" component={SearchPage} />

      <Route>
        <SimplePage title="页面未找到" body="你访问的页面不存在，请返回首页继续浏览。" />
      </Route>
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  if (!clerkPubKey) {
    return (
      <FirmsOverridesProvider>
        <Layout>
          <Router clerkEnabled={false} />
        </Layout>
      </FirmsOverridesProvider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <FirmsOverridesProvider>
        <Layout>
          <Router clerkEnabled={true} />
        </Layout>
      </FirmsOverridesProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
