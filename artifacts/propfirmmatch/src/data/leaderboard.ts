// Firm-level payouts leaderboard, computed at module load from PAYOUTS in
// data/payouts.ts (which is the scraped source from clone-data/page-payouts.md).
// No additional data is introduced here — this is purely a sort-by-total view
// of PAYOUTS. The source per-trader leaderboard at /futures/payouts-leaderboard
// requires authentication and is not present in the static capture.
import { PAYOUTS, type FirmPayoutAggregate } from "./payouts";

export const LEADERBOARD: FirmPayoutAggregate[] = [...PAYOUTS].sort((a,b)=>b.total-a.total);
