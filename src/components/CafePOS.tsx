import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

interface Props {
  onNext: () => void;
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

const MENU = [
  // ── Drinks ──
  { name: "Espresso",            price: 1.80, emoji: "☕",  cat: "Drinks"   },
  { name: "Cappuccino",          price: 3.00, emoji: "☕",  cat: "Drinks"   },
  { name: "Caramel Latte",       price: 3.80, emoji: "🤎",  cat: "Drinks"   },
  { name: "Matcha Latte",        price: 4.20, emoji: "🍵",  cat: "Drinks"   },
  { name: "Peppermint Tea",      price: 2.50, emoji: "🌿",  cat: "Drinks"   },
  { name: "Toma Apple Juice",    price: 2.00, emoji: "🍎",  cat: "Drinks"   },
  { name: "Toma Orange Juice",   price: 2.00, emoji: "🍊",  cat: "Drinks"   },
  { name: "Hot Chocolate",       price: 3.20, emoji: "🍫",  cat: "Drinks"   },
  { name: "Iced Americano",      price: 3.00, emoji: "🧊",  cat: "Drinks"   },
  { name: "Vanilla Latte",       price: 3.60, emoji: "🌼",  cat: "Drinks"   },
  { name: "Strawberry Milkshake",price: 4.50, emoji: "🍓",  cat: "Drinks"   },
  { name: "Lemon Tea",           price: 2.30, emoji: "🍋",  cat: "Drinks"   },
  // ── Pastries ──
  { name: "Croissant",           price: 2.20, emoji: "🥐",  cat: "Pastries" },
  { name: "Medovník",            price: 3.00, emoji: "🍯",  cat: "Pastries" },
  { name: "Apple Strudel",       price: 3.50, emoji: "🍎",  cat: "Pastries" },
  { name: "Cheesecake",          price: 3.80, emoji: "🍰",  cat: "Pastries" },
  { name: "Chocolate Brownie",   price: 3.20, emoji: "🍫",  cat: "Pastries" },
  { name: "Choco Biscuit Dip",   price: 2.50, emoji: "🍪",  cat: "Pastries" },
  { name: "Blueberry Muffin",    price: 2.50, emoji: "🫐",  cat: "Pastries" },
  { name: "Cinnamon Roll",       price: 2.80, emoji: "🌀",  cat: "Pastries" },
  { name: "Macarons",            price: 3.00, emoji: "🎀",  cat: "Pastries" },
  { name: "Waffle",              price: 4.00, emoji: "🧇",  cat: "Pastries" },
  // ── Food ──
  { name: "Fried Cheese",        price: 6.50, emoji: "🧀",  cat: "Food"     },
  { name: "Cheese Toast",        price: 4.50, emoji: "🍞",  cat: "Food"     },
  { name: "Cheese Platter",      price: 7.50, emoji: "🧀",  cat: "Food"     },
  { name: "Bruschetta",          price: 4.80, emoji: "🍅",  cat: "Food"     },
  { name: "Quiche Lorraine",     price: 5.50, emoji: "🥧",  cat: "Food"     },
  { name: "Caesar Salad",        price: 6.00, emoji: "🥗",  cat: "Food"     },
  { name: "Tomato Soup",         price: 4.00, emoji: "🍲",  cat: "Food"     },
  { name: "Panini",              price: 5.00, emoji: "🥪",  cat: "Food"     },
  { name: "Grilled Cheese Sand.",price: 5.20, emoji: "🧀",  cat: "Food"     },
  { name: "French Onion Soup",   price: 4.50, emoji: "🧅",  cat: "Food"     },
] as const;

type Cat = "Drinks" | "Pastries" | "Food";

// ─── Receipt type ──────────────────────────────────────────────────────────────

interface Receipt {
  customer: string;
  items: string[];
  customerMoney: number;
}

// ─── Random receipt generator ──────────────────────────────────────────────────

const CUSTOMERS = [
  "Ricky 🌸", "Gyuvin 🐮", "Hanbin 🍓", "Gunwook 🌙",
  "Hao 🌷", "Taerae 🌊",     "Matthew ☀️",  "Jiwoong 🐻",
  "Yujin 🌻", "Rinini ♡",
];

const MENU_NAMES = MENU.map((m) => m.name);

/** Pick the smallest common bill that's strictly greater than the total */
const nicePayment = (total: number): number => {
  const bills = [1, 2, 5, 10, 20, 50, 100];
  return bills.find((b) => b > total) ?? 100;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const generateReceipts = (): Receipt[] => {
  const TARGET_MIN   = 90;
  const MIN_ORDERS   = 10;
  const receipts: Receipt[] = [];
  let runningTotal   = 0;
  const customers    = shuffle(CUSTOMERS);

  // Keep going until we've hit at least MIN_ORDERS AND €90
  let i = 0;
  while (runningTotal < TARGET_MIN || receipts.length < MIN_ORDERS) {
    // Pick 1–3 unique random items per receipt
    const itemCount  = Math.floor(Math.random() * 3) + 1;
    const items      = shuffle(MENU_NAMES).slice(0, itemCount);
    const total      = items.reduce((s, n) => s + (MENU.find((m) => m.name === n)?.price ?? 0), 0);
    const customer   = customers[i % customers.length];

    receipts.push({
      customer,
      items,
      customerMoney: nicePayment(total),
    });

    runningTotal += total;
    i++;

    // Safety valve — never more than 20 orders
    if (receipts.length >= 20) break;
  }

  // Swap last customer to always be "Rinini ♡" as a sweet ending
  receipts[receipts.length - 1].customer = "Rinini ♡";

  return receipts;
};

const getPrice = (name: string) =>
  (MENU as readonly { name: string; price: number }[]).find((m) => m.name === name)?.price ?? 0;

const sumItems = (names: readonly string[]) =>
  names.reduce((s, n) => s + getPrice(n), 0);

// ─── Component ────────────────────────────────────────────────────────────────

const CafePOS = ({ onNext }: Props) => {
  const [receipts]                    = useState<Receipt[]>(() => generateReceipts());
  const [receiptIdx, setReceiptIdx]   = useState(0);
  const [cart, setCart]               = useState<string[]>([]);
  const [cat, setCat]                 = useState<Cat>("Drinks");
  const [payment, setPayment]         = useState("");
  const [totalSales, setTotalSales]   = useState(0);
  const [error, setError]             = useState<string | null>(null);
  const [feedback, setFeedback]       = useState<string | null>(null);
  const [isDone, setIsDone]           = useState(false);

  const TARGET       = receipts.reduce((s, r) => s + r.items.reduce((ss, n) => ss + (MENU.find((m) => m.name === n)?.price ?? 0), 0), 0);
  const receipt      = receipts[receiptIdx];
  const rTotal       = sumItems(receipt.items);
  const cartCost     = cart.reduce((s, n) => s + getPrice(n), 0);
  const paymentNum   = parseFloat(payment) || 0;
  const change       = paymentNum - rTotal;

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const flashError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  };

  const addItem = (name: string) => {
    setCart((p) => [...p, name]);
  };

  const removeItem = (idx: number) => {
    setCart((p) => p.filter((_, i) => i !== idx));
  };

  const confirmCheckout = () => {
    // 1. Validate cart matches receipt
    const cartSorted    = [...cart].sort().join("|");
    const receiptSorted = [...receipt.items].slice().sort().join("|");
    if (cartSorted !== receiptSorted) {
      flashError("wrong order — that doesn't match! 🙈 remove items and try again");
      return;
    }

    // 2. Validate payment amount
    if (Math.abs(paymentNum - receipt.customerMoney) > 0.009) {
      flashError(
        `customer paid €${receipt.customerMoney.toFixed(2)} — enter exactly that amount! 💙`
      );
      return;
    }

    // 3. ✅ All good — proceed
    const newTotal = totalSales + rTotal;
    setTotalSales(newTotal);

    const msg =
      receiptIdx === receipts.length - 1
        ? "🎉 last order — you did it!!"
        : `change: €${change.toFixed(2)} — next customer! 💕`;
    setFeedback(msg);

    setTimeout(() => {
      setFeedback(null);
      if (receiptIdx === receipts.length - 1) {
        setIsDone(true);
      } else {
        setReceiptIdx((p) => p + 1);
        setCart([]);
        setPayment("");
      }
    }, 1600);
  };

  // ── Done screen ──────────────────────────────────────────────────────────────
  if (isDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
        <FallingCharacters variant="gyunini" />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="z-10 bg-card/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-border text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="text-7xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-bold text-love-deep mb-2">
            amazing, baby!
          </h2>
          <p className="text-muted-foreground mb-1 text-lg">
            you served all {receipts.length} customers ☕
          </p>
          <p className="text-2xl font-semibold text-love-rose mb-6">
            total sales: €{TARGET.toFixed(2)} 🧋
          </p>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow text-lg"
          >
            next game →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const menuItems   = MENU.filter((m) => m.cat === cat);
  const progressPct = Math.min((totalSales / TARGET) * 100, 100);

  // ── Main layout ──────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      <FallingCharacters variant="gyunini" />

      {/* ── Header bar ── */}
      <div className="z-10 flex items-center justify-between px-6 py-3 bg-card/80 backdrop-blur-sm border-b border-border flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-love-deep leading-none">
            🧋 rinini's café
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 hidden sm:block">
            figure out what they ordered & collect their payment!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-base font-semibold text-love-deep">
            €{totalSales.toFixed(2)}
            <span className="text-muted-foreground font-normal">
              {" "}/ €{TARGET.toFixed(2)}
            </span>
          </div>
          <div className="w-28 sm:w-40 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "hsl(var(--primary))" }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap font-medium">
            {receiptIdx + 1} / {receipts.length}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="z-10 flex flex-1 flex-col lg:flex-row gap-3 p-3 overflow-auto lg:overflow-hidden min-h-0">

        {/* LEFT: Receipt paper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={receiptIdx}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            className="lg:w-72 xl:w-80 flex-shrink-0 flex"
          >
            <div
              className="flex-1 rounded-2xl shadow-xl overflow-hidden flex flex-col"
              style={{
                background: "#fefef0",
                boxShadow:
                  "0 6px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              {/* Tear top */}
              <div
                style={{
                  height: 16,
                  background:
                    "radial-gradient(circle at 50% 0, #fefef0 70%, transparent 72%) 0 0 / 22px 22px repeat-x, #e8dcc8",
                }}
              />

              <div
                className="flex-1 px-7 py-5 overflow-y-auto"
                style={{ fontFamily: "'Courier New', Courier, monospace" }}
              >
                {/* Receipt header */}
                <div className="text-center mb-5">
                  <div className="text-lg font-bold text-gray-700 tracking-widest uppercase">
                    rinini's café
                  </div>
                  <div className="text-sm text-gray-400 my-1.5">✦ ✦ ✦</div>
                  <div className="text-sm text-gray-500 border-b border-dashed border-gray-300 pb-3">
                    order #{String(receiptIdx + 1).padStart(3, "0")}
                  </div>
                </div>

                {/* Customer name */}
                <div className="text-xl font-bold text-gray-800 mb-5">
                  {receipt.customer}
                </div>

                {/* Items list */}
                <div className="space-y-3 mb-5">
                  {receipt.items.map((item) => {
                    const punched = cart.includes(item);
                    return (
                      <motion.div
                        key={item}
                        animate={{ opacity: punched ? 0.45 : 1 }}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span className={punched ? "text-green-500" : "text-gray-400"}>
                            {punched ? "✓" : "○"}
                          </span>
                          <span className={punched ? "line-through text-gray-400" : "text-gray-700"}>
                            {item}
                          </span>
                        </span>
                        <span className={punched ? "text-gray-400" : "text-gray-700"}>
                          €{getPrice(item).toFixed(2)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Customer payment */}
                <div className="border-t border-dashed border-gray-300 pt-4">
                  <div className="flex justify-between text-base font-bold text-gray-800 mb-1">
                    <span>TOTAL</span>
                    <span>€{rTotal.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                      customer pays
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      €{receipt.customerMoney.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tear bottom */}
              <div
                style={{
                  height: 16,
                  background:
                    "radial-gradient(circle at 50% 100%, #fefef0 70%, transparent 72%) 0 100% / 22px 22px repeat-x, #e8dcc8",
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* RIGHT: POS terminal */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">

          {/* Category tabs */}
          <div className="flex gap-2 flex-shrink-0">
            {(["Drinks", "Pastries", "Food"] as Cat[]).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  cat === c
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-card/80 text-muted-foreground hover:bg-card border border-border"
                }`}
              >
                {c === "Drinks"   ? "☕ Drinks"   :
                 c === "Pastries" ? "🍰 Pastries" :
                                    "🍽️ Food"}
              </button>
            ))}
          </div>

          {/* Menu grid */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => addItem(item.name)}
                  className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl border-2 bg-card border-border/60 hover:border-primary/40 hover:shadow-md transition-all text-center cursor-pointer"
                >
                  <span className="text-3xl leading-none">{item.emoji}</span>
                  <span className="text-sm font-semibold leading-tight text-foreground">
                    {item.name}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    €{item.price.toFixed(2)}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Order total / checkout panel */}
          <div className="bg-card/85 backdrop-blur-sm rounded-2xl p-5 border border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold text-love-deep">
                order total
              </span>
              <span className="text-sm text-muted-foreground">
                {cart.length} item{cart.length !== 1 ? "s" : ""} punched
              </span>
            </div>

            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                no items yet — tap from the menu above! 👆
              </p>
            ) : (
              <div className="space-y-1.5 mb-4">
                {cart.map((name, i) => (
                  <div
                    key={`${name}-${i}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground">{name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        €{getPrice(name).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors text-base leading-none font-bold"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-love-deep">
                  <span>subtotal</span>
                  <span>€{cartCost.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Cash input + checkout — always visible when cart has items */}
            {cart.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
                {/* Cash input */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">
                    €
                  </span>
                  <input
                    type="number"
                    placeholder="cash received..."
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    className="bg-background border border-input rounded-lg pl-7 pr-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Change display */}
                {paymentNum > 0 && paymentNum >= cartCost && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm text-muted-foreground"
                  >
                    change:{" "}
                    <span className="font-bold text-love-deep">
                      €{(paymentNum - cartCost).toFixed(2)}
                    </span>
                  </motion.div>
                )}

                {/* Checkout button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmCheckout}
                  className="ml-auto px-6 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground shadow hover:shadow-md transition-all"
                >
                  checkout ✓
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Error toast ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-destructive/10 border border-destructive/30 backdrop-blur px-6 py-3 rounded-2xl shadow-xl text-base font-semibold text-destructive max-w-xs text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Post-checkout flash ── */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-card/95 backdrop-blur-sm rounded-3xl px-10 py-8 shadow-2xl border border-border text-center">
              <div className="text-4xl mb-3">✨</div>
              <p className="text-xl font-bold text-love-deep">{feedback}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CafePOS;
