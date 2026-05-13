import { AppProviders } from "@/core/providers";
import { AppRouter } from "@/core/router";

const App = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);

export default App;
